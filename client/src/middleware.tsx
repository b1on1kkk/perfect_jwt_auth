import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import axios, { AxiosError } from "axios";

import { jwtVerify, SignJWT, decodeJwt } from "jose";

export const getJWTSecretKey = () => {
  const secret = process.env.JWT_SECRET_ACCESS_KEY;

  if (!secret || secret.length === 0) {
    throw new Error("Invalid token");
  }

  return secret;
};

export async function middleware(request: NextRequest, response: NextResponse) {
  const access_token = request.cookies.get("access")?.value;
  const refresh_token = request.cookies.get("refresh")?.value;

  // console.log(request.nextUrl.pathname);

  console.log(access_token, "----------------access_token----------------");
  console.log(refresh_token, "----------------refresh_token----------------");

  if (!access_token && !refresh_token) {
    return NextResponse.redirect(new URL("/registration/login", request.url));
  }

  if (access_token && !refresh_token) {
    return NextResponse.redirect(new URL("/registration/login", request.url));
  }

  if (access_token) {
    try {
      await jwtVerify(
        access_token,
        new TextEncoder().encode(getJWTSecretKey())
      );

      return;
    } catch (error) {
      return NextResponse.redirect(new URL("/registration/login", request.url));
    }
  }

  if (refresh_token) {
    try {
      const { data } = await axios.post<{
        tokens: {
          access: string;
          refresh: string;
        } | null;
      }>("http://localhost:4000/refresh", {
        refresh_token
      });

      console.log(data);

      if (data.tokens) {
        response.cookies.set("refresh", data.tokens.refresh);
        response.cookies.set("access", data.tokens.access);
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/registration/login", request.url));
    }
  }
}

export const config = {
  matcher: "/"
};
