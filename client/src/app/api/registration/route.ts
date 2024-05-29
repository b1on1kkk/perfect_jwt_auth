import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    hello: "worked"
  });
}

export const config = {
  api: {
    bodyParser: true
  }
};
