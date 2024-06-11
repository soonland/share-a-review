// import GET from "./[[...category]]";
// import pool from "../../../db"; // Importez la configuration de connexion à la base de données

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     return GET(req, res);
//   } else if (req.method === "POST") {
//     const { title, content } = req.body;
//     try {
//       // Exécutez la requête SQL pour insérer une nouvelle critique
//       const newReview = await pool.query("INSERT INTO reviews (title, content) VALUES ($1, $2) RETURNING *", [
//         title,
//         content,
//       ]);
//       res.status(201).json(newReview.rows[0]);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to submit review" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
