import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { guest } from './guest';
import { productVariants } from './variants';

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id),
  guestId: text('guest_id').references(() => guest.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
});
