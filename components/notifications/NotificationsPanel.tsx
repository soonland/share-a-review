import {
  SelectAll as SelectAllIcon,
  ClearAll as ClearAllIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Grid, Typography, Button, Box, Divider, Badge, IconButton } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";

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

  const filteredNotifications = notifications.filter(
    (notification) =>
      (notification.folder.toLowerCase() === currentView.folder.toLowerCase() &&
        currentView.type.toLowerCase() === "all") ||
      (notification.folder.toLowerCase() === currentView.folder.toLowerCase() &&
        notification.type === currentView.type),
  );

  const unreadNotifications = filteredNotifications.filter((notification) => notification.status === "unread");
  const readNotifications = filteredNotifications.filter((notification) => notification.status === "read");

  const handleSelectNotification = (id) => {
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

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
      {/* Barre latérale des filtres */}
      <Grid item xs={3} sx={{ borderRight: "1px solid #ddd", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("notifications.title")}
        </Typography>
        <Button
          variant={currentView.folder === "inbox" && currentView.type === "all" ? "contained" : "text"}
          fullWidth
          sx={{ mb: 1, justifyContent: "space-between" }}
          onClick={() => setCurrentView({ folder: "inbox", type: "all" })}
        >
          {t("notifications.sidebar.all")}
          <Badge
            color="error"
            badgeContent={notifications.filter((n) => n.status === "unread" && n.folder === "inbox").length}
          />
        </Button>
        <Button
          variant={currentView.folder === "inbox" && currentView.type === "user" ? "contained" : "text"}
          fullWidth
          sx={{ mb: 1, justifyContent: "space-between" }}
          onClick={() => setCurrentView({ folder: "inbox", type: "user" })}
        >
          {t("notifications.sidebar.user")}
          <Badge
            color="error"
            badgeContent={
              notifications.filter((n) => n.status === "unread" && n.type === "user" && n.folder !== "trash").length
            }
          />
        </Button>
        <Button
          variant={currentView.folder === "inbox" && currentView.type === "system" ? "contained" : "text"}
          fullWidth
          sx={{ justifyContent: "space-between" }}
          onClick={() => setCurrentView({ folder: "inbox", type: "system" })}
        >
          {t("notifications.sidebar.system")}
          <Badge
            color="error"
            badgeContent={
              notifications.filter((n) => n.status === "unread" && n.type === "system" && n.folder !== "trash").length
            }
          />
        </Button>
        <Button
          variant={currentView.folder === "trash" && currentView.type === "all" ? "contained" : "text"}
          fullWidth
          sx={{ justifyContent: "space-between" }}
          onClick={() => setCurrentView({ folder: "trash", type: "all" })}
        >
          {t("notifications.sidebar.trash")}
          <Badge
            color="error"
            badgeContent={notifications.filter((n) => n.status === "unread" && n.folder === "trash").length}
          />
        </Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          {t("notifications.sidebar.folders")}
          <IconButton size="small" sx={{ ml: 1 }} onClick={() => setOpenFolderDialog(true)}>
            <AddIcon />
          </IconButton>
        </Typography>
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={currentView.folder === folder.name.toLowerCase() ? "contained" : "text"}
            fullWidth
            sx={{ justifyContent: "space-between" }}
            onClick={() => setCurrentView({ folder: folder.name.toLowerCase(), type: "all" })}
            onMouseEnter={() => setHoveredFolder(folder.id)}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            {folder.name}
            <Badge
              color="error"
              badgeContent={
                notifications.filter(
                  (n) => n.status === "unread" && n.folder.toLowerCase() === folder.name.toLowerCase(),
                ).length
              }
            />
            {hoveredFolder === folder.id && (
              <IconButton
                size="small"
                sx={{ position: "absolute", right: 8 }}
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le clic d'affecter le bouton parent
                  deleteFolder(folder.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Button>
        ))}
      </Grid>

      <Grid item xs={9} sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ px: 2 }}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("notifications.unread")}
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            onClick={handleSelectAll}
          >
            {selectAll ? t("notifications.deselectAll") : t("notifications.selectAll")}
            <Box sx={{ display: "flex", alignItems: "center" }}>{selectAll ? <ClearAllIcon /> : <SelectAllIcon />}</Box>
          </Button>

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
        <NotificationFolderDialog openDialog={openFolderDialog} onClose={() => setOpenFolderDialog(false)} />
      </Grid>
    </Grid>
  );
};

export default NotificationsPanel;
