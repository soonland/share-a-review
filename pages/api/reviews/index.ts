import pool from "../../../db";
import { selectReviewsByCategory } from "../constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const query = req.query.q ? req.query.q.toLowerCase() : null;
      const values: string[] = [];
      if (query) values.push(`%${query}%`);
      const result = await client.query(selectReviewsByCategory("", query), values);

      client.release();

      res.status(200).json({ data: result.rows, success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else if (req.method === "POST") {
    const {
      title,
      content,
      userId,
      item: { id: itemId },
      rating,
    } = req.body;
    try {
      const newReview = await pool.query(
        "INSERT INTO reviews (user_id, item_id, title, content, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userId, itemId, title, content, rating],
      );
      res.status(201).json(newReview.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
