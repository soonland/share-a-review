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

const NotificationDialog = ({ notification, openDialog, onClose, setSelectedNotification, folders }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const moveNotification = async (id?: number, folder?: string) => {
    // Mettre à jour la notification dans la base de données
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ folder }),
      headers: myHeaders,
    });
    // Mettre à jour l'état de la notification localement
    setSelectedNotification((prevNotification) => ({ ...prevNotification, folder }));
  };

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
            onClick={() => moveNotification(notification?.id, notification?.folder === "trash" ? "inbox" : "trash")}
            color="primary"
          >
            <ListItemIcon>
              {notification?.folder === "trash" ? <MoveToInbox color="secondary" /> : <Delete color="secondary" />}
            </ListItemIcon>
            {notification?.folder === "trash" ? t("notifications.actions.restore") : t("notifications.actions.delete")}
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
          {notification?.folder === "inbox" && (
            <MenuItem color="primary">
              <ListItemIcon>
                <Reply color="secondary" />
              </ListItemIcon>
              {t("notifications.actions.reply")}
            </MenuItem>
          )}
          {notification?.folder !== "inbox" && (
            <MenuItem onClick={() => moveNotification(notification?.id, "inbox")} color="primary">
              <ListItemIcon>
                <DriveFileMove color="secondary" />
              </ListItemIcon>
              {t("notifications.actions.moveToInbox")}
            </MenuItem>
          )}
          {folders
            .filter(
              (folder) => folder.name !== "inbox" && folder.name !== "trash" && folder.name !== notification?.folder,
            )
            .map((folder) => (
              <MenuItem key={folder.id} onClick={() => moveNotification(notification?.id, folder.name)} color="primary">
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
