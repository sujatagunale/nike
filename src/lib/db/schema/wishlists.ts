import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { products } from './products';

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});
