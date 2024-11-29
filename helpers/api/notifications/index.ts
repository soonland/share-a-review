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

interface UpdateNotificationPayload {
  folder_id?: number;
  status?: string;
}

const updateNotification = async (notificationId: number, payload: UpdateNotificationPayload) => {
  console.log("payload", payload);
  const client = await pool.connect();

  // Filtrer les champs valides (ni null ni undefined)
  const entries = Object.entries(payload).filter(([, value]) => value !== null && value !== undefined);

  if (entries.length === 0) {
    throw new Error("No valid fields provided to update.");
  }

  // Extraire les clés et valeurs
  const keys = entries.map(([key]) => key);
  const values = entries.map(([, value]) => value);

  // Construire la clause SET
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const query = `UPDATE notifications SET ${setClause} WHERE id = $${keys.length + 1}`;

  // Exécuter la requête
  await client.query(query, [...values, notificationId]);

  client.release();

  return { success: true };
};

const moveNotifications = async (folderId: number, inboxFolderId: number) => {
  const client = await pool.connect();

  // Déplacer les notifications du dossier à la boîte de réception
  await client.query("UPDATE notifications SET folder_id = $1 WHERE folder_id = $2", [inboxFolderId, folderId]);

  client.release();
};

export { getNotifications, getNotificationsCount, sendNotification, updateNotification, moveNotifications };
