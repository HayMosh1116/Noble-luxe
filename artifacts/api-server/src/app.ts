import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";

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
 */

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

/*
 * =========================================================
 * API ROUTES
 * =========================================================
 */

app.use("/api", router);

export default app;
