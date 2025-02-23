import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();

      const result = await client.query(
        `SELECT id, name, slug, description_template 
        FROM categories
        ORDER BY 
            CASE 
                WHEN slug = 'other' THEN 1 
                ELSE 0 
            END,
            slug`,
      );

      const data = result.rows.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description_template: category.description_template,
        value: category.slug.toLowerCase(),
        label: category.name,
      }));

      client.release();

      res.status(200).json({ data, success: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
