import { pgTable, text, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { genders } from './filters/genders';
import { brands } from './brands';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  genderId: uuid('gender_id').notNull().references(() => genders.id),
  brandId: uuid('brand_id').notNull().references(() => brands.id),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
