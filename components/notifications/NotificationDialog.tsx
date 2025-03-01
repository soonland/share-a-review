/**
 * @fileoverview Dialog component for displaying and managing notification details
 */

import {
  MoreVert,
  Close,
  MoveToInbox,
  Delete,
  Markunread,
  Reply,
  KeyboardDoubleArrowLeft,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
  AccessTime,
  Person,
  Drafts,
  DriveFileMove,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  DialogContent,
  Typography,
  DialogActions,
  Box,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState, MouseEvent } from "react";
import { mutate } from "swr";

/**
 * A dialog component that displays notification details and provides actions for managing notifications.
 * Features include:
 * - Reading notification content
 * - Moving notifications between folders
 * - Marking as read/unread
 * - Deleting/restoring notifications
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - The notification object to display
 * @param {string} props.notification.id - Unique identifier for the notification
 * @param {string} props.notification.title - Title of the notification
 * @param {string} props.notification.message - Main content of the notification
 * @param {string} props.notification.status - Current status ('read' or 'unread')
 * @param {number} props.notification.folder_id - ID of the current folder
 * @param {string} props.notification.sender_name - Name of the notification sender
 * @param {string} props.notification.sent_at - Timestamp when notification was sent
 * @param {boolean} props.openDialog - Controls dialog visibility
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {Function} props.setSelectedNotification - Updates the selected notification state
 * @param {Array<Object>} props.folders - List of available folders
 * @param {number} props.folders[].id - Folder ID
 * @param {string} props.folders[].name - Folder name
 * @returns {JSX.Element} A dialog displaying notification details and action options
 */
const NotificationDialog = ({ notification, openDialog, onClose, setSelectedNotification, folders }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const inboxFolder = folders.filter((el) => el.name === "Inbox")[0]?.id;
  const trashFolder = folders.filter((el) => el.name === "Trash")[0]?.id;

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /**
   * Updates a notification's properties and refreshes the notifications list.
   *
   * @param {string} id - ID of the notification to update
   * @param {Object} payload - Properties to update
   * @param {string} [payload.status] - New status ('read' or 'unread')
   * @param {number} [payload.folder_id] - New folder ID
   * @returns {Promise<void>}
   */
  const updateNotification = async (id, payload) => {
    // Mettre à jour la notification dans la base de données
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: myHeaders,
    });
    // Mettre à jour l'état de la notification localement
    setSelectedNotification((prevNotification) => ({ ...prevNotification, ...payload }));
    mutate("/api/notifications");
  };

  return (
    <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={2} justifyContent={"space-between"}>
          {notification?.title}
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleOpenMenu} color="primary">
              <MoreVert color="secondary" />
            </IconButton>
            <IconButton onClick={onClose} color="primary">
              <Close color="secondary" />
            </IconButton>
          </Stack>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() =>
              updateNotification(notification?.id, {
                folder_id: notification?.folder_id === trashFolder ? inboxFolder : trashFolder,
              })
            }
            color="primary"
          >
            <ListItemIcon>
              {notification?.folder_id === trashFolder ? (
                <MoveToInbox color="secondary" />
              ) : (
                <Delete color="secondary" />
              )}
            </ListItemIcon>
            {notification?.folder_id === trashFolder
              ? t("notifications.actions.restore")
              : t("notifications.actions.delete")}
          </MenuItem>
          {notification?.status === "read" && (
            <MenuItem
              onClick={() =>
                updateNotification(notification?.id, {
                  status: "unread",
                })
              }
              color="primary"
            >
              <ListItemIcon>
                <Markunread color="secondary" />
              </ListItemIcon>
              {t("notifications.actions.markAsUnread")}
            </MenuItem>
          )}
          {notification?.status === "unread" && (
            <MenuItem
              onClick={() =>
                updateNotification(notification?.id, {
                  status: "read",
                })
              }
              color="primary"
            >
              <ListItemIcon>
                <Drafts color="secondary" />
              </ListItemIcon>
              {t("notifications.actions.markAsRead")}
            </MenuItem>
          )}
          <MenuItem color="primary">
            <ListItemIcon>
              <Reply color="secondary" />
            </ListItemIcon>
            {t("notifications.actions.reply")}
          </MenuItem>
          {notification?.folder_id !== inboxFolder && (
            <MenuItem onClick={() => updateNotification(notification?.id, { folder_id: inboxFolder })} color="primary">
              <ListItemIcon>
                <DriveFileMove color="secondary" />
              </ListItemIcon>
              {t("notifications.actions.moveToInbox")}
            </MenuItem>
          )}
          {folders
            .filter(
              (folder) => folder.name !== "Inbox" && folder.name !== "Trash" && folder.id !== notification?.folder_id,
            )
            .map((folder) => (
              <MenuItem
                key={folder.id}
                onClick={() => updateNotification(notification?.id, { folder_id: folder.id })}
                color="primary"
              >
                <ListItemIcon>
                  <DriveFileMove color="secondary" />
                </ListItemIcon>
                {t("notifications.actions.moveTo", { value: folder.name })}
              </MenuItem>
            ))}
        </Menu>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {notification?.message}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            p: 1,
            // bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {t("notifications.modal.from", { value: notification?.sender_name })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTime sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {t("notifications.modal.sentAt", { value: notification?.sent_at })}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <IconButton color="primary">
          <KeyboardDoubleArrowLeft color="secondary" />
        </IconButton>
        <IconButton color="primary">
          <KeyboardArrowLeft color="secondary" />
        </IconButton>
        <IconButton color="primary">
          <KeyboardArrowRight color="secondary" />
        </IconButton>
        <IconButton color="primary">
          <KeyboardDoubleArrowRight color="secondary" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
