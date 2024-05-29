import axios from "axios";

import { NextResponse, NextRequest } from "next/server";

import { jwtVerify, SignJWT } from "jose";

// get secret key from .env file safely
export const getJWTSecretKey = (secret: string | undefined) => {
  if (!secret || secret.length === 0) throw new Error("Invalid token");

  return secret;
};

// main middleware
export async function middleware(request: NextRequest, response: NextResponse) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("User-Agent", request.headers.get("user-agent")!);

  // get access and refresh token
  const access_token = request.cookies.get("access")?.value;
  const refresh_token = request.cookies.get("refresh")?.value;

  // if access token do not exist - redirect user to login page
  if (!access_token) {
    return NextResponse.redirect(new URL("/registration/login", request.url));
  }

  // otherwise move on
  try {
    // verify access token if it is not stale
    await jwtVerify(
      access_token,
      new TextEncoder().encode(
        getJWTSecretKey(process.env.JWT_SECRET_ACCESS_KEY)
      )
    );

    // if everything ok - just move on
    if (request.nextUrl.pathname !== "/") {
      NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    try {
      // if user has refresh token - move on
      if (refresh_token) {
        // if error with access token occured, it means that something does wrong with it, verify refresh token
        const decodedRefreshToken = await jwtVerify(
          refresh_token,
          new TextEncoder().encode(
            getJWTSecretKey(process.env.JWT_SECRET_REFRESH_KEY)
          )
        );

        // if fine, generate new access and refresh tokens
        const { new_access_token, new_refresh_token } =
          await handleTokenRefresh(
            request,
            decodedRefreshToken.payload.user_id as number
          );

        if (request.nextUrl.pathname !== "/") {
          const response = NextResponse.redirect(new URL("/", request.url));
          response.cookies.set("access", new_access_token);
          response.cookies.set("refresh", new_refresh_token);

          // move on with new cookies
          return response;
        }

        const response = NextResponse.next();
        response.cookies.set("access", new_access_token);
        response.cookies.set("refresh", new_refresh_token);

        // move on with new cookies
        return response;
      }

      return NextResponse.redirect(new URL("/registration/login", request.url));
    } catch (error) {
      return NextResponse.redirect(new URL("/registration/login", request.url));
    }
  }
}

async function handleTokenRefresh(request: NextRequest, user_id: number) {
  const old_refresh_token = request.cookies.get("refresh")?.value;

  // refresh token for 1h
  const new_refresh_token = await tokenGenerator(
    "1h",
    getJWTSecretKey(process.env.JWT_SECRET_REFRESH_KEY),
    user_id
  );

  // then get when refresh token was issued
  const decodedRefreshToken = await jwtVerify(
    new_refresh_token,
    new TextEncoder().encode(
      getJWTSecretKey(process.env.JWT_SECRET_REFRESH_KEY)
    )
  );

  // send request to the server to check if this refresh token is valid
  await axios.post(
    "http://localhost:4000/refresh",
    {
      issuedAt: decodedRefreshToken.payload.iat,
      refresh_token: old_refresh_token,
      device: request.headers.get("user-agent")
    },
    {
      withCredentials: true
    }
  );

  // generate new access token
  const new_access_token = await tokenGenerator(
    "30s",
    getJWTSecretKey(process.env.JWT_SECRET_ACCESS_KEY),
    user_id
  );

  // return new tokens
  return { new_access_token, new_refresh_token };
}

// just token generator
async function tokenGenerator(alive: string, secret: string, user_id: number) {
  return await new SignJWT({ user_id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(alive)
    .sign(new TextEncoder().encode(secret));
}

export const config = {
  matcher: "/"
};
