import pool from "@/db";

const getUsers = async () => {
  const client = await pool.connect();

  // Récupère tous les utilisateurs
  const result = await client.query("SELECT * FROM users");

  client.release();

  return { data: result.rows, success: true };
};

export { getUsers };
