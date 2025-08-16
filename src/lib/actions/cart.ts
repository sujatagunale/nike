"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema/carts";
import { productVariants, products } from "@/lib/db/schema";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";
import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { createGuestSession, getGuestSession } from "@/lib/auth/actions";

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

async function getOrCreateCartId() {
  const user = await getSessionUser();
  if (user) {
    const existing = await db.query.carts.findFirst({ where: eq(carts.userId, user.id) });
    if (existing) return existing.id;
    const [created] = await db.insert(carts).values({ userId: user.id }).returning();
    return created.id;
  } else {
    let g = await getGuestSession();
    if (!g) {
      const res = await createGuestSession();
      if (!("sessionToken" in res)) throw new Error("Failed to create guest session");
      g = await getGuestSession();
      if (!g) throw new Error("Guest session unavailable after creation");
    }
    const existing = await db.query.carts.findFirst({ where: eq(carts.guestId, g.id) });
    if (existing) return existing.id;
    const [created] = await db.insert(carts).values({ guestId: g.id }).returning();
    return created.id;
  }
}

export async function fetchCart() {
  const user = await getSessionUser();
  const cartRow =
    user
      ? await db.query.carts.findFirst({ where: eq(carts.userId, user.id) })
      : (await getGuestSession())
      ? await db.query.carts.findFirst({
          where: eq(carts.guestId, (await getGuestSession())!.id),
        })
      : null;

  if (!cartRow) return { items: [] as { variantId: string; productId: string; name: string; color: string; size: string; price: number; quantity: number }[] };

  const rows = await db
    .select({
      variantId: productVariants.id,
      productId: productVariants.productId,
      name: products.name,
      color: colors.name,
      size: sizes.name,
      price: productVariants.salePrice ?? productVariants.price,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .innerJoin(colors, eq(colors.id, productVariants.colorId))
    .innerJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(eq(cartItems.cartId, cartRow.id));

  return { items: rows.map((r) => ({ ...r, price: Number(r.price) })) };
}

export async function addItem(variantId: string, qty = 1) {
  const cartId = await getOrCreateCartId();
  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, variantId)),
  });
  if (existing) {
    await db.update(cartItems).set({ quantity: existing.quantity + qty }).where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, productVariantId: variantId, quantity: qty });
  }
  return { success: true };
}

export async function updateItem(variantId: string, qty: number) {
  const cartId = await getOrCreateCartId();
  if (qty <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, variantId)));
    return { success: true };
  }
  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, variantId)),
  });
  if (existing) {
    await db.update(cartItems).set({ quantity: qty }).where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, productVariantId: variantId, quantity: qty });
  }
  return { success: true };
}

export async function removeItem(variantId: string) {
  const cartId = await getOrCreateCartId();
  await db.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, variantId)));
  return { success: true };
}

export async function clearCart() {
  const cartId = await getOrCreateCartId();
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  return { success: true };
}
