import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ maintenanceMode: string }>) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? "false";
  res.status(200).json({ maintenanceMode });
}
