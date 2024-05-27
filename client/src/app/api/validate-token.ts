import { NextApiRequest, NextApiResponse } from "next";

export default async function validateToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.cookies);

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
}
