// middleware.ts
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, importJWK, JWTPayload } from "jose";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (.png, .jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
    "/user/:path*",
  ],
};
interface RequestWithUser extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  const secret = process.env.JWT_SECRET;

  try {
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const { payload } = await jwtVerify(token, jwk);

    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const withMobileAuth = async (req: RequestWithUser) => {
  if (req.headers.get("Auth-Key")) {
    return NextResponse.next();
  }
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const newHeaders = new Headers(req.headers);

  /**
   * Add a global object 'g'
   * it holds the request claims and other keys
   * easily pass around this key as request context
   */
  newHeaders.set("g", JSON.stringify(payload));
  return NextResponse.next({
    request: {
      headers: newHeaders,
    },
  });
};

const withAuth = async (req: NextRequestWithAuth) => {
  console.log("Processing auth for:", req.nextUrl.pathname);

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Token retrieved:", !!token);

    // Check if jwtToken exists and is valid
    if (!token) {
      console.log("No JWT token found. Redirecting to /auth/signin");
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if jwtToken exists and is valid
    if (!token.jwtToken) {
      console.log("No JWT token found in session. Token:", token);
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const jwtToken = token.jwtToken as string;
    const payload = await verifyJWT(jwtToken);

    if (!payload) {
      console.log("Invalid token. Redirecting to /invalidsession");
      return NextResponse.redirect(new URL("/invalidsession", req.url));
    }

    console.log("Authentication successful for user:", payload.id);
    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
};

export function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl;
  const publicPaths = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/invalidsession",
    "/api/auth",
  ];

  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/mobile")) {
    return withMobileAuth(req);
  }

  return withAuth(req);
}

export function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
