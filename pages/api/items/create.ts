import { NextApiRequest, NextApiResponse } from "next";

import { CategoryType } from "@/models/types";

import pool from "../../../db";

interface CreateItemRequest extends NextApiRequest {
  body: {
    categoryId: string;
    [key: string]: string | number; // For dynamic fields from description_template
  };
}

export default async function handler(req: CreateItemRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate required fields
      if (!req.body.categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      // Get category to validate the fields against description_template
      const categoryResult = await pool.query<{ description_template: CategoryType["description_template"] }>(
        "SELECT description_template FROM categories WHERE id = $1",
        [parseInt(req.body.categoryId, 10)],
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      const template = categoryResult.rows[0].description_template;
      const description: Record<string, string | number> = {};

      // Validate and transform fields according to their type
      for (const [field, fieldDef] of Object.entries(template)) {
        const value = req.body[field];
        if (!value && value !== 0) {
          return res.status(400).json({ error: `Field ${field} is required` });
        }

        // Type validation
        const type = typeof fieldDef === "object" ? fieldDef.type : fieldDef;
        if (type === "number") {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return res.status(400).json({ error: `Field ${field} must be a number` });
          }
          description[field] = numValue;
        } else if (type === "select") {
          if (typeof fieldDef === "object" && !fieldDef.options?.includes(value as string)) {
            return res.status(400).json({ error: `Invalid option for field ${field}` });
          }
          description[field] = value;
        } else {
          description[field] = value;
        }
      }

      const slug = description.name ? (description.name as string).toLowerCase().replace(/\s/g, "-") : "";

      const newItem = await pool.query(
        "INSERT INTO items (name, slug, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [description.name, slug, parseInt(req.body.categoryId, 10), JSON.stringify(description)],
      );

      res.status(201).json(newItem.rows[0]);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
