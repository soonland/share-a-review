import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import pool from "@/db";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const { method } = req;
  const { id } = req.query;

  if (method === "PATCH") {
    const { isAdmin } = req.body;

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ success: false, message: "Paramètre isAdmin manquant ou invalide" });
    }

    const client = await pool.connect();
    try {
      await client.query("UPDATE users SET is_admin = $1 WHERE id = $2", [isAdmin, id]);
      client.release();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut admin:", error);
      client.release();
      return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du statut admin" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
