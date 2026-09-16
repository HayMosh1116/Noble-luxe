-- Noble Luxe: orders table diagnosis + SAFE additive migration
-- Nothing here deletes, drops, or rewrites existing order data.

-- ============================================================
-- STEP 1 — Confirm you are on the intended production database
-- ============================================================
SELECT current_database(), current_user, inet_server_addr() AS host, version();

-- Does the table exist, and in which schema?
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name = 'noble_luxe_orders';

-- How many orders are in it (proves prod vs empty dev copy)?
SELECT count(*) AS order_count, min(created_at) AS first_order, max(created_at) AS last_order
FROM public.noble_luxe_orders;

-- ============================================================
-- STEP 2 — Compare live columns with what the code expects
-- ============================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'noble_luxe_orders'
ORDER BY ordinal_position;

-- Show exactly which expected columns are MISSING:
SELECT expected.column_name AS missing_column
FROM (VALUES
  ('id'),('order_id'),('user_id'),('customer_name'),('phone'),('email'),
  ('address'),('fulfilment_method'),('pickup_code'),('items'),('total'),
  ('payment_method'),('payment_screenshot'),('status'),('status_message'),
  ('created_at'),('updated_at')
) AS expected(column_name)
LEFT JOIN information_schema.columns c
  ON c.table_name = 'noble_luxe_orders'
 AND c.column_name = expected.column_name
WHERE c.column_name IS NULL;

-- ============================================================
-- STEP 3 — SAFE additive migration (idempotent, data-preserving)
-- Only adds columns that are absent. Run inside a transaction.
-- ============================================================
BEGIN;

ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS fulfilment_method text NOT NULL DEFAULT 'Delivery';
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS pickup_code text;
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS status_message text;
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.noble_luxe_orders ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique index the code relies on for order_id (created only if absent)
CREATE UNIQUE INDEX IF NOT EXISTS noble_luxe_orders_order_id_key
  ON public.noble_luxe_orders (order_id);

-- Helps the customer query (user_id + newest first)
CREATE INDEX IF NOT EXISTS noble_luxe_orders_user_created_idx
  ON public.noble_luxe_orders (user_id, created_at DESC);

COMMIT;

-- ============================================================
-- STEP 4 — Re-run STEP 2 to confirm zero missing columns,
-- then re-run STEP 1's count to confirm no data was lost.
-- ============================================================
