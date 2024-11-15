import { NextApiRequest, NextApiResponse } from "next";

import { readNotification, trashNotification } from "@/helpers/api/notifications";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "PATCH") {
    // Envoie une notification
    const {
      query: { id: notificationId, action },
    } = req;
    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    switch (action) {
      case "read":
        return res.json(readNotification(Number(notificationId)));
      case "trash":
        return res.json(trashNotification(Number(notificationId)));
      default:
        return res.status(404).json({ success: false, message: "Action non trouvée" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
