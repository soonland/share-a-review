import type { NextApiRequest, NextApiResponse } from "next";

import pool from "../../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const client = await pool.connect();
        const result = await client.query("SELECT id, name, slug, description_template FROM categories");
        client.release();

        return res.status(200).json({
          success: true,
          data: result.rows.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description_template: category.description_template,
            value: category.slug.toLowerCase(),
            label: category.name,
          })),
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la récupération des catégories",
        });
      }

    case "POST":
      try {
        const { name, slug, description_template } = req.body;

        const client = await pool.connect();

        // Verify if slug already exists
        const existingCategory = await client.query("SELECT id FROM categories WHERE slug = $1", [slug]);

        if (existingCategory.rows.length > 0) {
          client.release();
          return res.status(400).json({
            success: false,
            message: "Une catégorie avec ce slug existe déjà",
          });
        }

        // Insert new category
        const result = await client.query(
          `INSERT INTO categories (name, slug, description_template) 
           VALUES ($1, $2, $3) 
           RETURNING id, name, slug, description_template`,
          [name, slug, JSON.stringify(description_template)],
        );

        client.release();

        const category = result.rows[0];
        return res.status(201).json({
          success: true,
          data: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description_template: category.description_template,
            value: category.slug.toLowerCase(),
            label: category.name,
          },
        });
      } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la création de la catégorie",
        });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
  }
}
