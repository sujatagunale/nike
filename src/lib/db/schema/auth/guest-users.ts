import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const guestUsers = pgTable('guest_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull().unique(),
  cartData: jsonb('cart_data').default('{}'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
