import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const result = await client.query(
        `SELECT items.*, categories.name AS category_name
        FROM items JOIN categories ON items.category_id = categories.id
        ORDER BY category_name, items.name
        ;`,
      );

      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching items" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
