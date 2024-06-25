import pool from "../../../db";
import { selectReviewsByCategory } from "../constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const category = req.query.category ?? null;
      const query = req.query.q ?? null;

      const values: string[] = [];
      if (category) values.push(category?.[0].toLowerCase());
      if (query) values.push(`%${query.toLowerCase()}%`);
      const result = await client.query(selectReviewsByCategory(category, query), values);
      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      console.error("Error fetching reviews", error);
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
