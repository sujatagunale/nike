import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { addressTypeEnum } from '../enums/address-type';
import { users } from './users';

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: addressTypeEnum('type').notNull(),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
});


export const insertAddressSchema = createInsertSchema(addresses);
export const selectAddressSchema = createSelectSchema(addresses);
