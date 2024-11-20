import pool from "@/db";
import { getNotificationsFoldersQuery } from "@/pages/api/constants";

const getNotificationsFolders = async (userId: number) => {
  const client = await pool.connect();

  // Récupère toutes les notifications
  const result = await client.query(getNotificationsFoldersQuery(userId));

  client.release();

  return { data: result.rows, success: true };
};

const createNotificationFolder = async (userId: number, name: string) => {
  const client = await pool.connect();

  // Insérer le dossier de notification dans la base de données
  await client.query("INSERT INTO notifications_folders (user_id, name, type) VALUES ($1, $2, $3)", [
    userId,
    name,
    "user",
  ]);

  client.release();

  return { success: true };
};

const deleteNotificationFolder = async (folderId: number) => {
  const client = await pool.connect();

  // Supprimer le dossier de notification dans la base de données
  await client.query("DELETE FROM notifications_folders WHERE id = $1", [folderId]);

  client.release();

  return { success: true };
};

export { getNotificationsFolders, createNotificationFolder, deleteNotificationFolder };
