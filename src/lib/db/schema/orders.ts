import { pgTable, text, uuid, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user';
import { addresses } from './addresses';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').notNull().references(() => addresses.id),
  billingAddressId: uuid('billing_address_id').notNull().references(() => addresses.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
