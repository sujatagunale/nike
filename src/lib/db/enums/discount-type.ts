import { pgEnum } from 'drizzle-orm/pg-core';

export const discountTypeEnum = pgEnum('discount_type', [
  'percentage',
  'fixed'
]);
