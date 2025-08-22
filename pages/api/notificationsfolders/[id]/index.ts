import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { moveNotifications } from "@/helpers/api/notifications";
import {
  deleteNotificationFolder,
  getInboxFolderId,
  updateNotificationFolder,
} from "@/helpers/api/notificationsfolders";

import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }
  const { method } = req;

  if (method === "PATCH") {
    // Envoie une notification
    const {
      query: { id: folderId },
      body: { folderName },
    } = req;
    if (!folderId || !folderName) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    return res.json(await updateNotificationFolder(Number(folderId), folderName));
  } else if (method === "DELETE") {
    // Supprimer le dossier de notification dans la base de données
    const {
      query: { id: folderId },
    } = req;
    if (!folderId) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    // Déplacer les notifications du dossier à la boîte de réception
    const inboxFolder = await getInboxFolderId(session.user.id);
    await moveNotifications(Number(folderId), inboxFolder);
    return res.json(await deleteNotificationFolder(Number(folderId)));
  } else {
    res.setHeader("Allow", ["DELETE", "PATCH"]);
    return res.status(405).json(`Method ${method} Not Allowed`);
  }
}
