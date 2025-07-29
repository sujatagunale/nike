import { pgEnum } from 'drizzle-orm/pg-core';

export const addressTypeEnum = pgEnum('address_type', [
  'billing',
  'shipping'
]);
