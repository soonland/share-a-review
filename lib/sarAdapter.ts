import type { Adapter, AdapterUser } from "next-auth/adapters";

import pool from "@/db";

const createUserNotification = async (userId: number, title: string, type: "system" | "user") => {
  const client = await pool.connect();
  try {
    const notificationMessage = "Bienvenue sur notre plateforme !";
    // Ouvrir la transaction
    await client.query("BEGIN");
    const folderId = await client
      .query("INSERT INTO notifications_folders (user_id, name, type) VALUES ($1, $2, $3) RETURNING id", [
        userId,
        "Inbox",
        "system",
      ])
      .then((res) => {
        return res.rows[0].id;
      });
    await client.query("INSERT INTO notifications_folders (user_id, name, type) VALUES ($1, $2, $3) RETURNING id", [
      userId,
      "Trash",
      "system",
    ]);
    await client.query(
      "INSERT INTO notifications (sender_id, user_id, title, message, type, folder_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [1, userId, title, notificationMessage, type, folderId],
    );
    // Fermer la transaction
    await client.query("COMMIT");
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default function SarAdapter(): Adapter {
  const createUser = async (user: Omit<AdapterUser, "id">) => {
    const { name, email, emailVerified, image } = user;
    const sql = `
      INSERT INTO users (name, email, "emailVerified", image, is_admin) 
      VALUES ($1, $2, $3, $4, false) 
      RETURNING id, name, email, "emailVerified", image, is_admin`;
    const result = await pool.query(sql, [name, email, emailVerified, image]);
    await createUserNotification(result.rows[0].id, "Bienvenue sur notre plateforme !", "system");

    return result.rows[0];
  };

  const getUser = async (id: string) => {
    const sql = `
      SELECT id, name, email, "emailVerified", image, is_admin
      FROM users
      WHERE id = $1`;
    const result = await pool.query(sql, [id]);

    return result.rows[0];
  };

  const getUserByEmail = async (email: string) => {
    const sql = `
      SELECT id, name, email, "emailVerified", image, is_admin
      FROM users
      WHERE email = $1`;
    const result = await pool.query(sql, [email]);

    return result.rows[0];
  };

  const getUserByAccount = async ({ providerAccountId, provider }): Promise<AdapterUser | null> => {
    const sql = `
      select u.* from users u join accounts a on u.id = a."userId"
      where 
      a.provider = $1 
      and 
      a."providerAccountId" = $2`;

    const result = await pool.query(sql, [provider, providerAccountId]);
    return result.rowCount !== 0 ? result.rows[0] : null;
  };

  const updateUser = async (user: Partial<AdapterUser>) => {
    const { id, name, email, emailVerified, image } = user;
    const sql = `
      UPDATE users
      SET name = $2, email = $3, "emailVerified" = $4, image = $5
      WHERE id = $1
      RETURNING id, name, email, "emailVerified", image, is_admin`;
    const result = await pool.query(sql, [id, name, email, emailVerified, image]);

    return result.rows[0];
  };

  const deleteUser = async (userId: string) => {
    const sql = `
      DELETE FROM users
      WHERE id = $1`;
    await pool.query(sql, [userId]);
  };

  const linkAccount = async (account) => {
    const sql = `
      insert into accounts 
    (
      "userId", 
      provider, 
      type, 
      "providerAccountId", 
      access_token,
      expires_at,
      refresh_token,
      id_token,
      scope,
      session_state,
      token_type
    )
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    returning
      id,
      "userId", 
      provider, 
      type, 
      "providerAccountId", 
      access_token,
      expires_at,
      refresh_token,
      id_token,
      scope,
      session_state,
      token_type
    `;
    await pool.query(sql, [
      account.userId,
      account.provider,
      account.type,
      account.providerAccountId,
      account.access_token,
      account.expires_at,
      account.refresh_token,
      account.id_token,
      account.scope,
      account.session_state,
      account.token_type,
    ]);
  };

  return {
    createUser,
    getUser,
    getUserByEmail,
    getUserByAccount,
    updateUser,
    deleteUser,
    linkAccount,
  };
}
