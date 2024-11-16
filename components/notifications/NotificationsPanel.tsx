import { SelectAll, ClearAll } from "@mui/icons-material";
import { Grid, Typography, Button, Box, Divider, Badge } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";

import { CurrentNotificationView, Notification } from "@/models/types";

import NotificationDialog from "./NotificationDialog";
import NotificationItem from "./NotificationItem";

const NotificationsPanel: FC<{ notifications: Notification[] }> = ({ notifications }): ReactElement => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<CurrentNotificationView>({ folder: "inbox", type: "all" });
  const [selectedNotification, setSelectedNotification] = useState<Partial<Notification | null>>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredNotifications = notifications.filter(
    (notification) =>
      (notification.folder === currentView.folder.toLowerCase() && currentView.type.toLowerCase() === "all") ||
      (notification.folder === currentView.folder.toLowerCase() && notification.type === currentView.type),
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
    setOpenDialog(true);

    // Marquer la notification comme lue après un délai de 1 seconde
    setTimeout(async () => {
      // Mettre à jour la notification dans la base de données
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
  const onCloseDialog = () => {
    setSelectedNotification(null);
    setOpenDialog(false);
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
            <Box sx={{ display: "flex", alignItems: "center" }}>{selectAll ? <ClearAll /> : <SelectAll />}</Box>
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
          openDialog={openDialog}
          onClose={onCloseDialog}
          notification={selectedNotification}
          setSelectedNotification={setSelectedNotification}
        />
      </Grid>
    </Grid>
  );
};

export default NotificationsPanel;
