import {
  SelectAll as SelectAllIcon,
  ClearAll as ClearAllIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  ChevronLeft as CollapseIcon,
  MenuOpen as ExpandIcon,
  InboxOutlined as InboxIcon,
  PersonOutline as PersonIcon,
  ComputerOutlined as SystemIcon,
  DeleteOutline as TrashIcon,
  FolderOutlined as FolderIcon,
} from "@mui/icons-material";
import { Grid, Typography, Button, Box, Divider, Badge, IconButton, MenuItem, Menu, TextField } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";
import { mutate } from "swr";

import { CurrentNotificationView, Notification, NotificationFolder } from "@/models/types";

import NotificationDialog from "./NotificationDialog";
import NotificationFolderDialog from "./NotificationFolderDialog";
import NotificationItem from "./NotificationItem";

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

  // Fonction pour ouvrir le popup de notification
  const handleOpenDialog = async (notification: Notification) => {
    setSelectedNotification(notification);
    setOpenNotificationDialog(true);

    // Marquer la notification comme lue après un délai de 1 seconde
    setTimeout(async () => {
      // Mettre à jour la notification dans la base de données
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "read" }),
        headers: myHeaders,
      });
      // Mettre à jour l'état de la notification localement
      setSelectedNotification((prevNotification) => ({ ...prevNotification, status: "read" }));
      mutate("/api/notifications");
    }, 1000);
  };

  // Fonction pour fermer le popup de notification
  const onCloseNotificationDialog = () => {
    setSelectedNotification(null);
    setOpenNotificationDialog(false);
  };

  const deleteFolder = async (folderId: number) => {
    // Supprimer le dossier de notification dans la base de données
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    await fetch(`/api/notificationsfolders/${folderId}`, {
      method: "DELETE",
      headers: myHeaders,
    });
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, folderId: number) => {
    setMenuAnchor(event.currentTarget.parentElement);
    setSelectedFolderId(folderId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedFolderId(null);
  };

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
      {/* Barre latérale des filtres */}
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
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {!isCollapsed && (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t("notifications.title")}
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
          <Button
            variant={currentView.folder === "inbox" && currentView.type === "all" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView({ folder: "inbox", type: "all" })}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <InboxIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{t("notifications.sidebar.all")}</span>
                  <Badge
                    color="error"
                    badgeContent={notifications.filter((n) => n.status === "unread" && n.folder === "inbox").length}
                  />
                </Box>
              )}
            </Box>
          </Button>
          <Button
            variant={currentView.folder === "inbox" && currentView.type === "user" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView({ folder: "inbox", type: "user" })}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <PersonIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{t("notifications.sidebar.user")}</span>
                  <Badge
                    color="error"
                    badgeContent={
                      notifications.filter((n) => n.status === "unread" && n.type === "user" && n.folder === "inbox")
                        .length
                    }
                  />
                </Box>
              )}
            </Box>
          </Button>
          <Button
            variant={currentView.folder === "inbox" && currentView.type === "system" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView({ folder: "inbox", type: "system" })}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <SystemIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{t("notifications.sidebar.system")}</span>
                  <Badge
                    color="error"
                    badgeContent={
                      notifications.filter((n) => n.status === "unread" && n.type === "system" && n.folder === "inbox")
                        .length
                    }
                  />
                </Box>
              )}
            </Box>
          </Button>
          <Button
            variant={currentView.folder === "trash" && currentView.type === "all" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView({ folder: "trash", type: "all" })}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <TrashIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{t("notifications.sidebar.trash")}</span>
                  <Badge
                    color="error"
                    badgeContent={notifications.filter((n) => n.status === "unread" && n.folder === "trash").length}
                  />
                </Box>
              )}
            </Box>
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Titre de la section dossiers */}
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
        {/* Liste des dossiers */}
        {folders
          .filter((folder) => folder.type === "user")
          .map((folder) => (
            <Box key={folder.id} position="relative">
              <Button
                variant={currentView.folder === folder.name.toLowerCase() ? "contained" : "text"}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  minWidth: isCollapsed ? 48 : "auto",
                  width: "100%",
                  px: isCollapsed ? 1 : 2,
                }}
                onClick={() => setCurrentView({ folder: folder.name.toLowerCase(), type: "all" })}
                onMouseEnter={() => setHoveredFolder(folder.id)}
                onMouseLeave={() => setHoveredFolder(null)}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <FolderIcon sx={{ mr: isCollapsed ? 0 : 1 }} />
                  {!isCollapsed && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span>{folder.name}</span>
                      <Badge
                        color="error"
                        badgeContent={
                          notifications.filter(
                            (n) => n.status === "unread" && n.folder.toLowerCase() === folder.name.toLowerCase(),
                          ).length
                        }
                      />
                    </Box>
                  )}
                </Box>
                {hoveredFolder === folder.id && (
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", right: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMenu(e, folder.id);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Button>

              {/* Menu pour les actions de dossier */}
              <Menu
                id="folder-menu"
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor) && selectedFolderId === folder.id}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right", // Positionnement du menu par rapport à l'icône
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left", // Le menu s'étend à partir de cette position
                }}
                MenuListProps={{
                  "aria-labelledby": "folder-menu",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    setSelectedFolder(folder);
                    setOpenFolderDialog(true); // Ouvre le dialogue de renommage
                  }}
                >
                  <EditIcon sx={{ mr: 1 }} />
                  {t("notifications.actions.rename")}
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    handleCloseMenu();
                    await deleteFolder(folder.id); // Supprime le dossier
                    mutate("/api/notificationsfolders"); // Met à jour les dossiers de notification
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
