/**
 * Clerk Frontend API Proxy Middleware
 *
 * Proxies Clerk Frontend API requests through your domain.
 *
 * IMPORTANT:
 * - Only active in production.
 * - Must be mounted BEFORE express.json().
 */

import type { IncomingHttpHeaders } from "node:http";
import type { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const CLERK_FAPI = "https://frontend-api.clerk.dev";

export const CLERK_PROXY_PATH = "/api/__clerk";

/**
 * Returns the effective public hostname for the request.
 *
 * x-forwarded-host is preferred because the application may be
 * running behind Vercel or another reverse proxy.
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

export function clerkProxyMiddleware(): RequestHandler {
  /*
   * Clerk proxying is only required in production.
   */
  if (process.env.NODE_ENV !== "production") {
    return ((_req, _res, next) => {
      next();
    }) as RequestHandler;
  }

  const secretKey = process.env.CLERK_SECRET_KEY;

  /*
   * If Clerk isn't configured, simply continue to the next middleware.
   */
  if (!secretKey) {
    return ((_req, _res, next) => {
      next();
    }) as RequestHandler;
  }

  /*
   * Create the Clerk Frontend API proxy.
   *
   * The explicit cast keeps the proxy middleware compatible with
   * the Express types used by this workspace.
   */
  const proxy = createProxyMiddleware({
    target: CLERK_FAPI,
    changeOrigin: true,

    /*
     * Buffer responses without Content-Length so Vercel doesn't
     * reject them as chunked responses.
     */
    selfHandleResponse: true,

    pathRewrite: (path: string) =>
      path.replace(
        new RegExp(`^${CLERK_PROXY_PATH}`),
        "",
      ),

    on: {
      proxyReq: (proxyReq, req) => {
        const proxyUrl =
          process.env.CLERK_PROXY_URL?.trim() ||
          `https://${
            getClerkProxyHost(req) ||
            "nobleluxe18.com.ng"
          }${CLERK_PROXY_PATH}`;

        proxyReq.setHeader(
          "Clerk-Proxy-Url",
          proxyUrl,
        );

        proxyReq.setHeader(
          "Clerk-Secret-Key",
          secretKey,
        );

        const xff = req.headers["x-forwarded-for"];

        const clientIp =
          (Array.isArray(xff)
            ? xff[0]
            : xff
          )
            ?.split(",")[0]
            ?.trim() ||
          req.socket?.remoteAddress ||
          "";

        if (clientIp) {
          proxyReq.setHeader(
            "X-Forwarded-For",
            clientIp,
          );
        }
      },

      proxyRes: (proxyRes, req, res) => {
        const headers = {
          ...proxyRes.headers,
        };

        /*
         * Hop-by-hop headers must not be forwarded.
         */
        delete headers["transfer-encoding"];
        delete headers["connection"];
        delete headers["keep-alive"];

        const status =
          proxyRes.statusCode ?? 502;

        /*
         * Content-Length is not allowed on 1xx/204 responses.
         */
        if (
          status < 200 ||
          status === 204
        ) {
          delete headers["content-length"];
        }

        const bodyless =
          req.method === "HEAD" ||
          status < 200 ||
          status === 204 ||
          status === 304;

        /*
         * Responses that already have a known length can
         * be streamed directly.
         */
        if (
          headers["content-length"] !== undefined ||
          bodyless
        ) {
          res.writeHead(
            status,
            headers,
          );

          proxyRes.on(
            "error",
            () => {
              res.destroy();
            },
          );

          proxyRes.pipe(res);

          return;
        }

        /*
         * Buffer responses without Content-Length so we can
         * provide an explicit length to the Vercel edge.
         */
        const chunks: Buffer[] = [];

        proxyRes.on(
          "data",
          (chunk: Buffer) => {
            chunks.push(chunk);
          },
        );

        proxyRes.on(
          "end",
          () => {
            const body =
              Buffer.concat(chunks);

            headers["content-length"] =
              String(body.length);

            res.writeHead(
              status,
              headers,
            );

            res.end(body);
          },
        );

        proxyRes.on(
          "error",
          () => {
            if (!res.headersSent) {
              res.writeHead(
                502,
                {
                  "content-length": "0",
                },
              );
            }

            res.end();
          },
        );
      },
    },
  });

  return proxy as unknown as RequestHandler;
}