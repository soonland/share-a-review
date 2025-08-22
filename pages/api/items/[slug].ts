import { selectItem } from "@/lib/sql";

import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const slug = req.query.slug;
      const client = await pool.connect();

      const result = await client.query(selectItem(), [slug]);

      client.release();

      res.status(200).json({ data: result.rows, success: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching items" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
