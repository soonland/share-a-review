import type { NextApiRequest, NextApiResponse } from "next";

import pool from "../../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PATCH":
      try {
        const { id } = req.query;
        const { slug, description_template } = req.body;

        const client = await pool.connect();

        // Verify if slug already exists for other categories
        const existingCategory = await client.query("SELECT id FROM categories WHERE slug = $1 AND id != $2", [
          slug,
          id,
        ]);

        if (existingCategory.rows.length > 0) {
          client.release();
          return res.status(400).json({
            success: false,
            message: "Une catégorie avec ce slug existe déjà",
          });
        }

        // Update category
        const result = await client.query(
          `UPDATE categories 
           SET slug = $1, description_template = $2 
           WHERE id = $3 
           RETURNING id, slug, description_template`,
          [slug, JSON.stringify(description_template), id],
        );

        client.release();

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Catégorie non trouvée",
          });
        }

        const category = result.rows[0];
        return res.status(200).json({
          success: true,
          data: {
            ...category,
            value: category.slug.toLowerCase(),
            label: category.slug.toLowerCase(),
          },
        });
      } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la mise à jour de la catégorie",
        });
      }

    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
}
