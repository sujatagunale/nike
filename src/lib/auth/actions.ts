"use server";

import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { guest } from "../db/schema";
import { carts, cartItems } from "../db/schema/carts";
import { auth } from "./config";
import { signInSchema, signUpSchema } from "./schemas";

export async function signUp(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    if (!result.user) {
      return { error: "Failed to create account" };
    }

    await mergeGuestCartWithUserCart(result.user.id);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account" };
  }
}

export async function signIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (!result.user) {
      return { error: "Invalid email or password" };
    }

    await mergeGuestCartWithUserCart(result.user.id);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Failed to sign in" };
  }
}

export async function signOut() {
  try {
    // await auth.api.signOut();
    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: "Failed to sign out" };
  }
}

export async function createGuestSession() {
  try {
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(guest).values({
      id: uuidv4(),
      sessionToken,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    return { success: true, sessionToken };
  } catch (error) {
    console.error("Create guest session error:", error);
    return { error: "Failed to create guest session" };
  }
}

export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return null;
    }

    const guestSession = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, sessionToken))
      .limit(1);

    if (guestSession.length === 0 || guestSession[0].expiresAt < new Date()) {
      if (guestSession.length > 0) {
        await db.delete(guest).where(eq(guest.sessionToken, sessionToken));
      }
      cookieStore.delete("guest_session");
      return null;
    }

    return guestSession[0];
  } catch (error) {
    console.error("Get guest session error:", error);
    return null;
  }
}

export async function mergeGuestCartWithUserCart(userId: string) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;
    if (!sessionToken) return { success: true };

    const guestRows = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, sessionToken))
      .limit(1);

    if (!guestRows.length) return { success: true };
    const guestRow = guestRows[0];

    const guestCart = await db.query.carts.findFirst({ where: eq(carts.guestId, guestRow.id) });
    const guestItems = guestCart
      ? await db.select().from(cartItems).where(eq(cartItems.cartId, guestCart.id))
      : [];

    let userCart = await db.query.carts.findFirst({ where: eq(carts.userId, userId) });
    if (!userCart) {
      const [created] = await db.insert(carts).values({ userId }).returning();
      userCart = created;
    }

    for (const gi of guestItems) {
      const existing = await db.query.cartItems.findFirst({
        where: and(eq(cartItems.cartId, userCart.id), eq(cartItems.productVariantId, gi.productVariantId)),
      });
      if (existing) {
        await db.update(cartItems).set({ quantity: existing.quantity + gi.quantity }).where(eq(cartItems.id, existing.id));
      } else {
        await db.insert(cartItems).values({
          cartId: userCart.id,
          productVariantId: gi.productVariantId,
          quantity: gi.quantity,
        });
      }
    }

    if (guestCart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
      await db.delete(carts).where(eq(carts.id, guestCart.id));
    }
    await db.delete(guest).where(eq(guest.sessionToken, sessionToken));
    cookieStore.delete("guest_session");

    return { success: true };
  } catch (error) {
    console.error("Merge guest cart error:", error);
    return { error: "Failed to merge guest cart" };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user ?? null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
