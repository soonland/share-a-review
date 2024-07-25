import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("req.body", req.body);
    const { name, categoryId } = req.body;
    const description = { ...req.body, categoryId: undefined };
    try {
      const slug = name.toLowerCase().replace(/\s/g, "-");
      const newReview = await pool.query(
        "INSERT INTO items (name, slug, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, slug, parseInt(categoryId, 10), JSON.stringify(description)],
      );
      res.status(201).json(newReview.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create item" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
