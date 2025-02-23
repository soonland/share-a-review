import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { getUsers } from "@/helpers/api/users"; // Assurez-vous que cette fonction existe

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Vérifier l'authentification
  if (!session?.user) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  const { method } = req;

  if (method === "GET") {
    return res.json(await getUsers());
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
