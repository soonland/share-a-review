import pool from "../../../db"; // Importez la configuration de connexion à la base de données
import { selectReviewsByCategory } from "../constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const category = req.query.category ? req.query.category.toLowerCase() : null;
      const query = req.query.q ? req.query.q.toLowerCase() : null;
      const values: string[] = [];
      if (category) values.push(category);
      if (query) values.push(`%${query}%`);
      const result = await client.query(selectReviewsByCategory(category, query), values);
      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
