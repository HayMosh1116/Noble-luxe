/**
 * Clerk Frontend API Proxy Middleware
 *
 * The Noble Luxe production Clerk instance uses the custom
 * Frontend API domain:
 *
 * https://clerk.nobleluxe18.com.ng
 *
 * The old Replit/Cloud Run proxy implementation is no longer
 * required for the Vercel API.
 */

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
 * Clerk proxy middleware.
 *
 * The production Clerk Frontend API is already configured
 * on the Noble Luxe custom domain, so the Vercel API does
 * not need to proxy Clerk requests.
 */
export function clerkProxyMiddleware(): RequestHandler {
  const middleware: RequestHandler = (
    _req,
    _res,
    next,
  ) => {
    next();
  };

  return middleware;
}