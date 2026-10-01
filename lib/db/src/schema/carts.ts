import {
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const cartsTable = pgTable("noble_luxe_carts", {
  userId: text("user_id").primaryKey(),
  items: jsonb("items").notNull().default([]),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export type CartRow = typeof cartsTable.$inferSelect;
export type InsertCartRow = typeof cartsTable.$inferInsert;
