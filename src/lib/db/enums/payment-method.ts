import { pgEnum } from 'drizzle-orm/pg-core';

export const paymentMethodEnum = pgEnum('payment_method', [
  'stripe',
  'paypal',
  'cod'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'initiated',
  'completed',
  'failed'
]);
