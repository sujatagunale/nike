import { pgTable, text, numeric, integer, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').notNull().references(() => colors.id),
  sizeId: uuid('size_id').notNull().references(() => sizes.id),
  inStock: integer('in_stock').notNull().default(0),
  weight: numeric('weight').notNull(),
  dimensions: jsonb('dimensions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
