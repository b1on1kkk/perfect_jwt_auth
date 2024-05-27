import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import axios from "axios";

export async function middleware(request: NextRequest) {
  const access_cookie = request.cookies.get("access")?.value;

  console.log(access_cookie, "--------worked");

  try {
    const data = await axios.post("http://localhost:4000/check", {
      withCredentials: true
    });

    console.log(data);
  } catch (error) {
    console.log(error, "------------");
  }

  return NextResponse.redirect(new URL("/registration/login", request.url));
}

export const config = {
  matcher: "/"
};
