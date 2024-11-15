import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { sendNotification } from "@/helpers/api/notifications";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const { method } = req;

  if (method === "POST") {
    // Envoie une notification
    const { sender_id, user_id, title, message } = req.body;
    if (!sender_id || !message || !user_id || !title) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    return res.json(sendNotification(sender_id, user_id, title, message));
  } else {
    return res.status(404).json({ success: false, message: "Action non trouvée" });
  }
}
