import { pgTable, uuid, integer } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { productVariants } from './variants';

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull().default(1),
});
