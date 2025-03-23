/**
 * @fileoverview Main panel for displaying and managing notifications with folder organization
 */

import {
  SelectAll as SelectAllIcon,
  ClearAll as ClearAllIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ChevronLeft as CollapseIcon,
  MenuOpen as ExpandIcon,
  InboxOutlined as InboxIcon,
  PersonOutline as PersonIcon,
  ComputerOutlined as SystemIcon,
  DeleteOutline as TrashIcon,
  FolderOutlined as FolderIcon,
} from "@mui/icons-material";
import { Grid, Typography, Button, Box, Divider, IconButton, MenuItem, Menu, TextField } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";
import { mutate } from "swr";

import { CurrentNotificationView, Notification, NotificationFolder } from "@/models/types";

import NotificationDialog from "./NotificationDialog";
import NotificationFolderDialog from "./NotificationFolderDialog";
import NotificationItem from "./NotificationItem";
import { SidebarButton, getUnreadCount } from "./SidebarNavigation";

/**
 * Main panel component for managing notifications with folder organization.
 * Features include:
 * - Collapsible sidebar with folders
 * - Read/Unread notifications grouping
 * - Search functionality
 * - Bulk selection actions
 * - Notification type filtering (All/User/System)
 * - Custom folder management
 *
 * @param {Object} props - Component props
 * @param {Notification[]} props.notifications - Array of notifications to display
 * @param {NotificationFolder[]} props.folders - Array of available notification folders
 * @returns {ReactElement} A grid layout containing sidebar and notifications list
 */
const NotificationsPanel: FC<{ notifications: Notification[]; folders: NotificationFolder[] }> = ({
  notifications,
  folders,
}): ReactElement => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<CurrentNotificationView>({ folder: "inbox", type: "all" });
  const [selectedNotification, setSelectedNotification] = useState<Partial<Notification | null>>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<NotificationFolder | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      !searchText ||
      (notification.title?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (notification.message?.toLowerCase().includes(searchText.toLowerCase()) ?? false);

    const matchesFolder = notification.folder.toLowerCase() === currentView.folder.toLowerCase();
    const matchesType = currentView.type.toLowerCase() === "all" || notification.type === currentView.type;

    return matchesSearch && matchesFolder && matchesType;
  });

  const unreadNotifications = filteredNotifications.filter((notification) => notification.status === "unread");
  const readNotifications = filteredNotifications.filter((notification) => notification.status === "read");

  /**
   * Toggles selection state of a notification.
   *
   * @param {number} id - ID of the notification to toggle
   */
  const handleSelectNotification = (id: number) => {
    setSelectedNotifications((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((notificationId) => notificationId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((notification) => notification.id));
    }
    setSelectAll(!selectAll);
  };

  /**
   * Opens notification dialog and marks notification as read after delay.
   *
   * @param {Notification} notification - Notification to display and mark as read
   */
  const handleOpenDialog = async (notification: Notification) => {
    setSelectedNotification(notification);
    setOpenNotificationDialog(true);

    setTimeout(async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "read" }),
        headers: myHeaders,
      });
      setSelectedNotification((prevNotification) => ({ ...prevNotification, status: "read" }));
      mutate("/api/notifications");
    }, 1000);
  };

  const onCloseNotificationDialog = () => {
    setSelectedNotification(null);
    setOpenNotificationDialog(false);
  };

  /**
   * Deletes a notification folder.
   *
   * @param {number} folderId - ID of the folder to delete
   * @returns {Promise<void>}
   */
  const deleteFolder = async (folderId: number) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`/api/notificationsfolders/${folderId}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    if (!response.ok) {
      throw new Error(`Failed to delete folder: ${response.status} ${response.statusText}`);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, folderId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFolderId(folderId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedFolderId(null);
  };

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
      <Grid
        item
        xs={isCollapsed ? 1 : 3}
        sx={{
          width: isCollapsed ? 80 : "auto",
          minWidth: isCollapsed ? 80 : "auto",
          maxWidth: isCollapsed ? 80 : "25%",
          borderRight: "1px solid #ddd",
          p: 2,
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
        }}
        data-testid="testid.notificationsPanel.sidebar"
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {!isCollapsed && (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t("notifications.mailboxes.title")}
            </Typography>
          )}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              ml: isCollapsed ? "auto" : 1,
            }}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <SidebarButton
            icon={InboxIcon}
            label={t("notifications.sidebar.all")}
            isSelected={currentView.folder === "inbox" && currentView.type === "all"}
            isCollapsed={isCollapsed}
            unreadCount={getUnreadCount(notifications, "inbox")}
            onClick={() => setCurrentView({ folder: "inbox", type: "all" })}
          />
          <SidebarButton
            icon={PersonIcon}
            label={t("notifications.sidebar.user")}
            isSelected={currentView.folder === "inbox" && currentView.type === "user"}
            isCollapsed={isCollapsed}
            unreadCount={getUnreadCount(notifications, "inbox", "user")}
            onClick={() => setCurrentView({ folder: "inbox", type: "user" })}
          />
          <SidebarButton
            icon={SystemIcon}
            label={t("notifications.sidebar.system")}
            isSelected={currentView.folder === "inbox" && currentView.type === "system"}
            isCollapsed={isCollapsed}
            unreadCount={getUnreadCount(notifications, "inbox", "system")}
            onClick={() => setCurrentView({ folder: "inbox", type: "system" })}
          />
          <SidebarButton
            icon={TrashIcon}
            label={t("notifications.sidebar.trash")}
            isSelected={currentView.folder === "trash" && currentView.type === "all"}
            isCollapsed={isCollapsed}
            unreadCount={getUnreadCount(notifications, "trash")}
            onClick={() => setCurrentView({ folder: "trash", type: "all" })}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {!isCollapsed && (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {t("notifications.sidebar.folders")}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedFolder(null);
                  setOpenFolderDialog(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </>
          )}
        </Box>
        {folders
          .filter((folder) => folder.type === "user")
          .map((folder) => (
            <Box
              key={folder.id}
              onMouseEnter={() => setHoveredFolder(folder.id)}
              onMouseLeave={() => setHoveredFolder(null)}
            >
              <SidebarButton
                icon={FolderIcon}
                label={folder.name}
                isSelected={currentView.folder === folder.name.toLowerCase()}
                isCollapsed={isCollapsed}
                unreadCount={getUnreadCount(notifications, folder.name)}
                onClick={() => setCurrentView({ folder: folder.name.toLowerCase(), type: "all" })}
                onOptionsClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(e, folder.id);
                }}
                showOptions={hoveredFolder === folder.id}
                data-testid={`testid.notificationsPanel.folderButton-${folder.id}`}
              />
              <Menu
                id="folder-menu"
                anchorEl={menuAnchor}
                data-testid="testid.notificationsPanel.folderOptions"
                open={Boolean(menuAnchor) && selectedFolderId === folder.id}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                MenuListProps={{
                  "aria-labelledby": "folder-menu",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    setSelectedFolder(folder);
                    setOpenFolderDialog(true);
                  }}
                >
                  <EditIcon sx={{ mr: 1 }} />
                  {t("notifications.actions.rename")}
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    try {
                      handleCloseMenu();
                      await deleteFolder(folder.id);
                      mutate("/api/notificationsfolders");
                    } catch (error) {
                      console.error("Error deleting folder:", error);
                      // Keep menu closed but don't mutate on error
                    }
                  }}
                >
                  <DeleteIcon sx={{ mr: 1 }} />
                  {t("notifications.actions.delete")}
                </MenuItem>
              </Menu>
            </Box>
          ))}
      </Grid>

      <Grid
        item
        xs={isCollapsed ? 11 : 9}
        sx={{
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            {t("notifications.title")}
          </Typography>

          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
              label={t("notifications.search")}
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleSelectAll}
              startIcon={selectAll ? <ClearAllIcon /> : <SelectAllIcon />}
            >
              {selectAll ? t("notifications.deselectAll") : t("notifications.selectAll")}
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom>
            {t("notifications.unread")}
          </Typography>

          {unreadNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              selectedNotifications={selectedNotifications}
              handleSelectNotification={handleSelectNotification}
              handleOpenDialog={handleOpenDialog}
              setSelectedNotification={setSelectedNotification}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            {t("notifications.read")}
          </Typography>

          {readNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              selectedNotifications={selectedNotifications}
              handleSelectNotification={handleSelectNotification}
              handleOpenDialog={handleOpenDialog}
              setSelectedNotification={setSelectedNotification}
            />
          ))}
        </Box>

        <NotificationDialog
          openDialog={openNotificationDialog}
          onClose={onCloseNotificationDialog}
          notification={selectedNotification}
          setSelectedNotification={setSelectedNotification}
          folders={folders}
        />
        <NotificationFolderDialog
          openDialog={openFolderDialog}
          onClose={() => setOpenFolderDialog(false)}
          selectedFolder={selectedFolder}
        />
      </Grid>
    </Grid>
  );
};

export default NotificationsPanel;
