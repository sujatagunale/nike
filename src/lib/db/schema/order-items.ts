import { pgTable, uuid, integer, numeric } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { productVariants } from './variants';

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
});
