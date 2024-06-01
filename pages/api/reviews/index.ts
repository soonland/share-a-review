// api/reviews.js

import pool from "../../../db"; // Importez la configuration de connexion à la base de données

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT * FROM reviews as r INNER JOIN users as u ON r.user_id = u.id ORDER BY r.date_created DESC;",
      );
      const reviews = result.rows;
      res.status(200).json({ data: reviews, success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Erreur lors de la récupération des reviews", severity: "error" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
