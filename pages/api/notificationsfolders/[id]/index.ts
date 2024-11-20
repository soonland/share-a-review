import { NextApiRequest, NextApiResponse } from "next";

import { updateNotification } from "@/helpers/api/notifications";
import { deleteNotificationFolder } from "@/helpers/api/notificationsfolders";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "PATCH") {
    // Envoie une notification
    const {
      query: { id: notificationId },
      body: { folder, status },
    } = req;
    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    return res.json(await updateNotification(Number(notificationId), { folder, status }));
  } else if (method === "DELETE") {
    // Supprimer le dossier de notification dans la base de données
    const {
      query: { id: folderId },
    } = req;
    if (!folderId) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    return res.json(await deleteNotificationFolder(Number(folderId)));
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
