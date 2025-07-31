import { pgTable, text, uuid, boolean } from 'drizzle-orm/pg-core';
import { products } from './products';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  url: text('url').notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
});
