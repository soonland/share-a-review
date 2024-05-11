import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { ISearch } from "../../../models/types";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISearch>) {
  const { accessToken } = await getServerSession(req, res, authOptions);

  async function fetchWebApi(endpoint: string, method: string) {
    const url = `https://api.spotify.com/${endpoint}?q=${req.query.q}&type=${(req.query.type as string).replaceAll(",", "%2C")}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      // body:JSON.stringify(body)
    });
    return await res.json();
  }

  const search = async () => {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return await fetchWebApi("v1/search", "GET");
  };

  const results = await search();
  res.status(200).json(results);
}
