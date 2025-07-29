import { pgEnum } from 'drizzle-orm/pg-core';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid', 
  'shipped',
  'delivered',
  'cancelled'
]);
