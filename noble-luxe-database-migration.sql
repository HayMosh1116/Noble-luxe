-- =========================================================
-- NOBLE LUXE: DATABASE MIGRATION SCRIPT
-- Tables: noble_luxe_products, noble_luxe_carts, noble_luxe_orders
-- =========================================================

CREATE TABLE IF NOT EXISTS noble_luxe_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  collection TEXT NOT NULL DEFAULT 'Round Necks',
  category TEXT NOT NULL DEFAULT 'T-Shirts',
  price NUMERIC(12, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  description TEXT,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  color_images JSONB,
  featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS noble_luxe_carts (
  user_id TEXT PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_collection ON noble_luxe_products(collection);
CREATE INDEX IF NOT EXISTS idx_products_featured ON noble_luxe_products(featured);
