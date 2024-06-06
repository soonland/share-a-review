import pool from "../../../db"; // Importez la configuration de connexion à la base de données
import { selectReviews } from "../constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const result = await client.query(selectReviews());

      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
