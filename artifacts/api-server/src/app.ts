import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import type { IncomingHttpHeaders } from "node:http";

import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

import {
  clerkMiddleware,
  type ClerkMiddlewareOptionsCallback,
} from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";

import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware.js";

const app = express();

const NOBLE_LUXE_CLERK_HOST = "nobleluxe18.com.ng";

const CLERK_ALLOWED_HOSTS = new Set([
  NOBLE_LUXE_CLERK_HOST,
  `www.${NOBLE_LUXE_CLERK_HOST}`,
]);

function getRequestHostname(req: {
  headers: Record<string, string | string[] | undefined>;
}): string | undefined {
  const host = getClerkProxyHost(req);

  return host
    ?.trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .split(":")[0];
}

function getClerkPublishableKey(req: {
  headers: IncomingHttpHeaders;
}): string | undefined {
  const requestHostname = getRequestHostname(req);

  const configuredKey = process.env.CLERK_PUBLISHABLE_KEY?.trim();

  if (
    !requestHostname ||
    !CLERK_ALLOWED_HOSTS.has(requestHostname)
  ) {
    return configuredKey || undefined;
  }

  // The browser uses the Production Clerk instance behind the
  // Noble Luxe custom domain. Deriving the key here keeps API
  // verification aligned with the key emitted by Clerk on both
  // the apex and www storefront hostnames.
  return publishableKeyFromHost(
    NOBLE_LUXE_CLERK_HOST,
    configuredKey,
  );
}

/*
 * =========================================================
 * LOGGER
 * =========================================================
 */

app.use(
  pinoHttp({
    logger,

    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },

      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

/*
 * =========================================================
 * CLERK PROXY
 * =========================================================
 */

app.use(
  CLERK_PROXY_PATH,
  clerkProxyMiddleware(),
);

/*
 * =========================================================
 * CORS
 * =========================================================
 */

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

/*
 * =========================================================
 * BODY PARSING
 * =========================================================
 */

app.use(
  express.json({
    limit: "12mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
 * =========================================================
 * CLERK AUTHENTICATION
 * =========================================================
 *
 * A repository checkout can be booted before the Replit-managed
 * Clerk secrets have been provisioned. Keep public catalog/health
 * routes usable in that state; protected handlers still return
 * 401 through their auth helper.
 */

if (process.env.CLERK_SECRET_KEY) {
  const clerkOptions: ClerkMiddlewareOptionsCallback = (req) => ({
    publishableKey: getClerkPublishableKey(
      req as unknown as {
        headers: IncomingHttpHeaders;
      },
    ),
  });

  app.use(
    clerkMiddleware(clerkOptions),
  );
}

/*
 * =========================================================
 * API ROUTES
 * =========================================================
 */

app.use("/api", router);

/*
 * =========================================================
 * PRODUCTION STOREFRONT
 * =========================================================
 *
 * Vercel serves the Noble Luxe frontend separately.
 * The API service only handles /api/* routes.
 *
 * Replit fallback storefront serving is intentionally disabled
 * here while the backend is being migrated to Vercel.
 */

export default app;