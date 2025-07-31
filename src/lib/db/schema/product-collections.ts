import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { products } from './products';
import { collections } from './collections';

export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
});
