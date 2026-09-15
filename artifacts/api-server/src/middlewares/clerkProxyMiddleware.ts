import type { IncomingHttpHeaders } from "node:http";
import type { RequestHandler } from "express";

export const CLERK_PROXY_PATH = "/api/__clerk";

/**
 * Returns the public hostname for the current request.
 *
 * x-forwarded-host is preferred because Vercel sits behind
 * a reverse proxy.
 */
export function getClerkProxyHost(req: {
  headers: IncomingHttpHeaders;
}): string | undefined {
  const forwarded = req.headers["x-forwarded-host"];

  const raw = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded;

  const firstHop = raw?.split(",")[0]?.trim();

  return (
    firstHop ||
    req.headers.host?.trim() ||
    undefined
  );
}

/**
 * Clerk Frontend API proxy.
 *
 * The Noble Luxe production Clerk instance now uses the
 * custom Frontend API domain:
 *
 * https://clerk.nobleluxe18.com.ng
 *
 * Therefore the old Replit/Cloud Run proxy implementation
 * is no longer required by the Vercel API.
 */
export function clerkProxyMiddleware(): RequestHandler {
  return (
    _req: Parameters<RequestHandler>[0],
    _res: Parameters<RequestHandler>[1],
    next: Parameters<RequestHandler>[2],
  ) => {
    next();
  };
}