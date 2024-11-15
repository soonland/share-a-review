import { Delete, Markunread, Drafts, SelectAll, ClearAll, DeleteForever } from "@mui/icons-material";
import {
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  Badge,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";

const NotificationsPanel = ({ notifications }) => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredNotifications =
    selectedType === "All"
      ? notifications
      : notifications.filter(
          (notification) =>
            notification.type === selectedType.toLowerCase() || notification.status === selectedType.toLowerCase(),
        );

  const unreadNotifications = filteredNotifications.filter((notification) => notification.status === "unread");
  const readNotifications = filteredNotifications.filter(
    (notification) =>
      notification.status === "read" || (notification.status === "trashed" && selectedType === "trashed"),
  );

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
  const handleOpenDialog = (notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);

    // Marquer la notification comme lue après un délai de 1 seconde
    setTimeout(() => {
      // Mettre à jour la notification dans la base de données
      fetch(`/api/notifications/${notification.id}/read`, { method: "PATCH" });
      // Mettre à jour l'état de la notification localement
      setSelectedNotification((prevNotification) => ({ ...prevNotification, status: "read" }));
    }, 1000);
  };

  // Fonction pour fermer le popup de notification
  const handleCloseDialog = () => {
    setSelectedNotification(null);
    setOpenDialog(false);
  };

  const trashNotification = async (id) => {
    // Mettre à jour la notification dans la base de données
    await fetch(`/api/notifications/${id}/trash`, { method: "PATCH" });
    // Mettre à jour l'état de la notification localement
    setSelectedNotification((prevNotification) => ({ ...prevNotification, status: "trashed" }));
  };

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
      {/* Barre latérale des filtres */}
      <Grid item xs={3} sx={{ borderRight: "1px solid #ddd", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Button
          variant={selectedType === "All" ? "contained" : "text"}
          fullWidth
          sx={{ mb: 1, justifyContent: "space-between" }}
          onClick={() => setSelectedType("All")}
        >
          Tous
          <Badge color="error" badgeContent={notifications.filter((n) => n.status === "unread").length} />
        </Button>
        <Button
          variant={selectedType === "user" ? "contained" : "text"}
          fullWidth
          sx={{ mb: 1, justifyContent: "space-between" }}
          onClick={() => setSelectedType("user")}
        >
          Utilisateurs
          <Badge
            color="error"
            badgeContent={notifications.filter((n) => n.status === "unread" && n.type === "user").length}
          />
        </Button>
        <Button
          variant={selectedType === "system" ? "contained" : "text"}
          fullWidth
          sx={{ justifyContent: "space-between" }}
          onClick={() => setSelectedType("system")}
        >
          Système
          <Badge
            color="error"
            badgeContent={notifications.filter((n) => n.status === "unread" && n.type === "system").length}
          />
        </Button>
        <Button
          variant={selectedType === "trashed" ? "contained" : "text"}
          fullWidth
          sx={{ justifyContent: "space-between" }}
          onClick={() => setSelectedType("trashed")}
        >
          Corbeille
          <Badge color="error" badgeContent={notifications.filter((n) => n.status === "trashed").length} />
        </Button>
      </Grid>

      {/* Liste des notifications */}
      <Grid item xs={9} sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ px: 2 }}>
          {/* Section Non lues */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Notifications non lues
          </Typography>

          {/* Sélectionner/désélectionner toutes les notifications */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            onClick={handleSelectAll}
          >
            {selectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
            <Box sx={{ display: "flex", alignItems: "center" }}>{selectAll ? <ClearAll /> : <SelectAll />}</Box>
          </Button>

          {unreadNotifications.map((notification) => (
            <Box
              key={notification.id}
              onClick={() => handleOpenDialog(notification)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: notification.status === "unread" ? "primary.light" : "background.paper",
                borderRadius: 1,
                cursor: "pointer",
                mb: 1,
                flexDirection: "row", // Aligner sur une seule ligne
              }}
            >
              {/* Case à cocher pour sélection individuelle */}
              <Checkbox
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
                color="primary"
                size="small"
              />

              {/* Icône de statut de lecture */}
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Badge color="error" variant="dot" invisible={notification.status === "read"}>
                  {notification.status === "read" ? <Drafts color="action" /> : <Markunread color="action" />}
                </Badge>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", ml: 2, flexGrow: 1 }}>
                  {notification.title} {/* Le titre prend tout l'espace restant */}
                </Typography>
              </Box>

              {/* Date et bouton de suppression */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                  {notification.sent_at}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation(); /* handleDelete(notification.id); */
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Section Lues */}
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Notifications lues
          </Typography>

          {readNotifications.map((notification) => (
            <Box
              key={notification.id}
              onClick={() => handleOpenDialog(notification)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: notification.status === "unread" ? "primary.light" : "background.paper",
                borderRadius: 1,
                cursor: "pointer",
                mb: 1,
                flexDirection: "row", // Aligner sur une seule ligne
              }}
            >
              <Checkbox
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
                color="primary"
                size="small"
              />

              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                {notification.status === "read" ? <Drafts color="action" /> : <Markunread color="primary" />}
                <Typography variant="subtitle1" sx={{ fontWeight: "normal", ml: 2, flexGrow: 1 }}>
                  {notification.title} {/* Le titre prend tout l'espace restant */}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                  {notification.sent_at}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation(); /* handleDelete(notification.id); */
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Popup de notification */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>{selectedNotification?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {selectedNotification?.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`Envoyée le: ${selectedNotification?.sent_at}`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <IconButton onClick={() => trashNotification(selectedNotification.id)} color="primary">
              <DeleteForever color="secondary" />
            </IconButton>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default NotificationsPanel;
