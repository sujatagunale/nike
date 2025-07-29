import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  slug: text('slug').notNull().unique(),
});

export const insertGenderSchema = createInsertSchema(genders);
export const selectGenderSchema = createSelectSchema(genders);
