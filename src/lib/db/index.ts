import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl && databaseUrl !== "postgresql://username:password@host:port/database" 
  ? neon(databaseUrl) 
  : null;
export const db = sql ? drizzle(sql, { schema }) : null;
