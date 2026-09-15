# Noble Luxe

Noble Luxe is a Lagos-based luxury streetwear storefront with authenticated checkout, payment screenshot review, customer order history, and admin fulfilment updates.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, Clerk production keys, `ORDER_ADMIN_EMAIL`, `ORDER_NOTIFICATION_EMAIL`, and Gmail OAuth variables (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (served by Replit today and by a Vercel Node function at `api/[...path].ts`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/noble-luxe` — storefront pages, checkout, account, confirmation, and admin orders.
- `artifacts/api-server` — Express API routes for products, orders, Clerk auth, and Gmail notifications.
- `lib/api-spec/openapi.yaml` — source of truth for the API contract.
- `lib/db/src/schema` — Drizzle/Postgres schema.

## Architecture decisions

- Delivery and Pickup are separate OpenAPI request branches so address validation is conditional.
- Pickup uses the fixed Baruwa location and stores that location in the existing nullable order address field.
- The API artifact owns `/api`; Vercel routes it through `api/[...path].ts`, while the storefront artifact owns `/`.
- Customer order reads are authenticated and scoped to the signed-in Clerk user; admin order reads retain the existing admin guard.

## Product

- Customers browse the collection, choose Delivery or Pickup, upload transfer proof, and track order status.
- Admins review orders, update status, and enter pickup confirmation codes.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen`.
- Pickup orders must send `pickupLocation` and must not require a delivery address. Payment screenshots stay in PostgreSQL as data URLs; keep uploads under 3MB so Vercel's 4.5MB function payload limit is not exceeded.
- The API service must remain routed at `/api`; changing it to `/` causes a collision with the storefront.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
