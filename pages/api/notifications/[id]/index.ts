import { NextApiRequest, NextApiResponse } from "next";

import { updateNotification } from "@/helpers/api/notifications";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "PATCH") {
    // Envoie une notification
    const {
      query: { id: notificationId },
      body: { folder_id, status },
    } = req;
    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }
    return res.json(await updateNotification(Number(notificationId), { folder_id, status }));
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
