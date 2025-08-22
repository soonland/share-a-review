import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { createNotificationFolder, getNotificationsFolders } from "@/helpers/api/notificationsfolders";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const { method } = req;

  switch (method) {
    case "GET":
      return res.json(await getNotificationsFolders(session.user.id));
    case "POST": {
      // Envoie une notification
      const { folderName } = req.body;
      if (!folderName) {
        return res.status(400).json({ success: false, message: "Paramètres manquants" });
      }
      return res.json(await createNotificationFolder(session.user.id, folderName));
    }
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "PATCH", "DELETE"]);
      return res.status(405).json(`Method ${method} Not Allowed`);
  }
}
