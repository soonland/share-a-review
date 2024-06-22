import pool from "../../../db"; // Importez la configuration de connexion à la base de données
import { selectLatestReviewedItems, selectMostRatedItemsByCategory, selectMostRecentItems } from "../constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      let result;
      if (req.query.type === "latest.reviewed") {
        result = await client.query(selectLatestReviewedItems());
      } else if (req.query.type === "most.recent") {
        result = await client.query(selectMostRecentItems());
      } else if (req.query.type === "most.rated") {
        result = await client.query(selectMostRatedItemsByCategory());
      } else if (req.query.type === "list") {
        result = await client.query(
          `SELECT items.*, categories.name AS category_name
        FROM items JOIN categories ON items.category_id = categories.id
        ORDER BY category_name, items.name
        ;`,
        );
      }

      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching items" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
