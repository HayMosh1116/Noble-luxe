import { jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("noble_luxe_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: text("order_id").notNull().unique(),
  userId: text("user_id"),

  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),

  paymentMethod: text("payment_method").notNull(),
  paymentScreenshot: text("payment_screenshot").notNull(),

  status: text("status").notNull().default("pending"),
  statusMessage: text("status_message"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow().notNull(),
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;
