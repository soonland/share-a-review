import pool from "@/db";
import { getNotificationsQuery, getNotificationsCountQuery } from "@/pages/api/constants";

const getNotifications = async (userId: number) => {
  const client = await pool.connect();

  // Récupère toutes les notifications
  const result = await client.query(getNotificationsQuery(userId));

  client.release();

  return { data: result.rows, success: true };
};

const getNotificationsCount = async (userId: number) => {
  const client = await pool.connect();

  // Requête pour obtenir le nombre de notifications non lues
  const result = await client.query(getNotificationsCountQuery(userId));

  client.release();

  const unreadCount = parseInt(result.rows[0].count, 10);
  return { count: unreadCount, success: true };
};

const sendNotification = async (senderId: number, userId: number, title: string, message: string) => {
  const client = await pool.connect();

  // Insérer la notification dans la base de données
  await client.query("INSERT INTO notifications (sender_id, user_id, title, message) VALUES ($1, $2, $3, $4)", [
    senderId,
    userId,
    title,
    message,
  ]);

  client.release();

  return { success: true };
};

const readNotification = async (notificationId: number) => {
  const client = await pool.connect();

  // Insérer la notification dans la base de données
  await client.query("UPDATE notifications SET status = 'read' WHERE id = $1", [notificationId]);

  client.release();

  return { success: true };
};

const trashNotification = async (notificationId: number) => {
  const client = await pool.connect();

  // Insérer la notification dans la base de données
  await client.query("UPDATE notifications SET status = 'trashed' WHERE id = $1", [notificationId]);

  client.release();

  return { success: true };
};

export { getNotifications, getNotificationsCount, sendNotification, readNotification, trashNotification };
