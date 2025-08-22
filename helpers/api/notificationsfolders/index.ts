import pool from "@/db";
import { getNotificationsFoldersQuery } from "@/lib/sql";

const getInboxFolderId = async (userId: number) => {
  const client = await pool.connect();
  const result = await client.query("SELECT id FROM notifications_folders WHERE user_id = $1 AND name = 'Inbox'", [
    userId,
  ]);
  client.release();
  return result.rows[0].id;
};

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

  // Déplacer les notifications du dossier à la boîte de réception
  await client.query(
    "UPDATE notifications SET folder_id = (SELECT id FROM notifications_folders WHERE user_id = $1 AND name = 'Inbox') WHERE folder_id = $2",
    [folderId, folderId],
  );
  // Supprimer le dossier de notification dans la base de données
  await client.query("DELETE FROM notifications_folders WHERE id = $1", [folderId]);

  client.release();

  return { success: true };
};

const updateNotificationFolder = async (folderId: number, folderName: string) => {
  const client = await pool.connect();

  // Mettre à jour le dossier de notification dans la base de données
  await client.query("UPDATE notifications_folders SET name = $1 WHERE id = $2", [folderName, folderId]);

  client.release();

  return { success: true };
};

export {
  getInboxFolderId,
  getNotificationsFolders,
  createNotificationFolder,
  deleteNotificationFolder,
  updateNotificationFolder,
};
