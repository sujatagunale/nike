import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { products } from './products';
import { user } from './user';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  userId: text('user_id').notNull().references(() => user.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
