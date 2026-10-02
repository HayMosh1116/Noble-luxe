import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const inventoryLogsTable = pgTable("noble_luxe_inventory_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  changeType: text("change_type").notNull().default("manual_update"),
  reason: text("reason"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export type InventoryLogRow = typeof inventoryLogsTable.$inferSelect;
export type InsertInventoryLogRow = typeof inventoryLogsTable.$inferInsert;
