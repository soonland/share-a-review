import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const result = await client.query("SELECT LOWER(slug) as value, LOWER(slug) as label FROM categories");

      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
