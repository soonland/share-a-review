import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("req.body", req.body);
    const { name, categoryId } = req.body;
    try {
      const slug = name.toLowerCase().replace(/\s/g, "-");
      const newReview = await pool.query(
        "INSERT INTO items (name, slug, category_id, description, date_created) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, slug, parseInt(categoryId, 10), JSON.stringify(req.body), new Date()],
      );
      res.status(201).json(newReview.rows[0]);
    } catch (error) {
      console.error("Failed to submit review", error);
      res.status(500).json({ error: "Failed to submit review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
