import { Drafts, Markunread, Delete } from "@mui/icons-material";
import { Box, Checkbox, Badge, Typography, IconButton } from "@mui/material";

/**
 * A component that renders an individual notification item in a list.
 * Features include:
 * - Visual distinction between read/unread states
 * - Checkbox for bulk selection
 * - Delete action
 * - Click handling for opening notification details
 *
 * @param {Object} props - Component props
 * @param {Object} props.notification - The notification to display
 * @param {number} props.notification.id - Notification identifier
 * @param {string} props.notification.title - Notification title
 * @param {string} props.notification.status - Current status ('read' or 'unread')
 * @param {string} props.notification.sent_at - Timestamp when notification was sent
 * @param {Function} props.handleOpenDialog - Handler for opening the notification dialog
 * @param {Array<number>} props.selectedNotifications - Array of selected notification IDs
 * @param {Function} props.handleSelectNotification - Handler for notification selection
 * @param {Function} props.setSelectedNotification - Updates the selected notification state
 * @returns {JSX.Element} A box containing the notification information and actions
 */
const NotificationItem = ({
  notification,
  handleOpenDialog,
  selectedNotifications,
  handleSelectNotification,
  setSelectedNotification,
}) => {
  /**
   * Moves a notification to a different folder.
   *
   * @param {number} [id] - ID of the notification to move
   * @param {string} [folder] - Destination folder name
   * @returns {Promise<void>}
   */
  const moveNotification = async (id?: number, folder?: string) => {
    try {
      // Mettre à jour la notification dans la base de données
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ folder }),
        headers: myHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Mettre à jour l'état de la notification localement
      setSelectedNotification((prevNotification) => ({ ...prevNotification, folder }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Handles the delete action with error handling
   */
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await moveNotification(notification.id, "trash");
    } catch (error) {
      console.error(error);
    }
  };

  const isRead = notification.status === "read";

  return (
    <Box
      data-testid="testid.notificationItem.container"
      key={notification.id}
      onClick={() => handleOpenDialog(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
      onKeyUp={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenDialog(notification);
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        bgcolor: notification.status === "unread" ? "primary.light" : "background.paper",
        borderRadius: 1,
        cursor: "pointer",
        mb: 1,
        flexDirection: "row",
      }}
    >
      <Checkbox
        data-testid="testid.notificationItem.checkbox"
        checked={selectedNotifications.includes(notification.id)}
        onClick={(e) => e.stopPropagation()}
        onChange={() => handleSelectNotification(notification.id)}
        color="primary"
        size="small"
      />

      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Badge
          color="error"
          variant="dot"
          invisible={isRead}
          role="status"
          className={`MuiBadge-dot ${isRead ? "MuiBadge-invisible" : ""}`}
        >
          {isRead ? <Drafts color="action" /> : <Markunread color="action" />}
        </Badge>
        <Typography
          variant="subtitle1"
          data-testid="testid.notificationItem.title"
          sx={{ fontWeight: notification.status === "unread" ? "700" : "400", ml: 2, flexGrow: 1 }}
        >
          {notification.title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="caption"
          data-testid="testid.notificationItem.timestamp"
          color="text.secondary"
          sx={{ mr: 2 }}
        >
          {notification.sent_at}
        </Typography>
        <IconButton edge="end" aria-label="delete" data-testid="testid.notificationItem.delete" onClick={handleDelete}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NotificationItem;
