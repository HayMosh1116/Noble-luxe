import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import router from "./routes";
import { logger } from "./lib/logger";

import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";

import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

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
    limit: "8mb",
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
 * A repository checkout can be booted before the Replit-managed Clerk
 * secrets have been provisioned. Keep public catalog/health routes usable in
 * that state; protected handlers still return 401 through their auth helper.
 */
if (process.env.CLERK_SECRET_KEY) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
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
 * The API artifact is the runnable Replit production service. Serve the
 * compiled Noble Luxe SPA from that same service so the published app has a
 * working root route while `/api/*` remains the API surface.
 */
if (process.env.NODE_ENV === "production") {
  const storefrontDistPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../noble-luxe/dist/public",
  );

  app.use(express.static(storefrontDistPath, { index: false }));

  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res, next) => {
    res.sendFile(resolve(storefrontDistPath, "index.html"), (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

export default app;
