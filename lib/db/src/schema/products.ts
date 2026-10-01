import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("noble_luxe_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  collection: text("collection").notNull().default("Round Necks"),
  category: text("category").notNull().default("T-Shirts"),
  price: numeric("price", {
    precision: 12,
    scale: 2,
  }).notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  colorImages: jsonb("color_images").$type<Record<string, { name: string; front: string; back?: string }>>(),
  featured: boolean("featured").notNull().default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export type ProductRow = typeof productsTable.$inferSelect;
export type InsertProductRow = typeof productsTable.$inferInsert;
