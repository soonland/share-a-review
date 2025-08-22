import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { getNotificationsCount } from "@/helpers/api/notifications";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const { method } = req;

  if (method === "GET") {
    return res.json(await getNotificationsCount(session.user.id));
  }
  res.setHeader("Allow", ["POST", "GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).json(`Method ${method} Not Allowed`);
}
