import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: db ? drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }) : undefined,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP: no verification
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  cookies: {
    sessionToken: {
      name: "auth_session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
  },
  socialProviders: {},
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  plugins: [nextCookies()],
});
