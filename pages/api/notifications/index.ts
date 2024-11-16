import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { getNotifications, sendNotification } from "@/helpers/api/notifications";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const {
    query: { action },
    method,
  } = req;

  switch (method) {
    case "GET":
      return res.json(await getNotifications(session.user.id));
    case "POST":
      if (action === "send") {
        // Envoie une notification
        const { sender_id, user_id, title, message } = req.body;
        if (!sender_id || !message || !user_id || !title) {
          return res.status(400).json({ success: false, message: "Paramètres manquants" });
        }
        return res.json(await sendNotification(sender_id, user_id, title, message));
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
