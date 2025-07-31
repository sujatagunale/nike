import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.includes('username:password@host:port')) {
  console.warn('DATABASE_URL is not configured properly. Database operations will fail.');
}

const sql = neon(databaseUrl || 'postgresql://user:pass@localhost:5432/db');
export const db = drizzle(sql, { schema });
