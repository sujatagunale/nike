"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useCart } from "@/lib/store/cart";
import { fetchCart, updateItem } from "@/lib/actions/cart";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCart();
  const syncing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { items } = await fetchCart();
      if (!mounted) return;
      items.forEach((srv) => {
        const cur = store.items[srv.variantId];
        if (!cur) {
          store.addItem(
            {
              variantId: srv.variantId,
              productId: srv.productId,
              name: srv.name,
              color: srv.color,
              size: srv.size,
              price: Number(srv.price),
              image: null,
            },
            srv.quantity
          );
        } else if (cur.quantity !== srv.quantity) {
          store.updateQuantity(srv.variantId, srv.quantity);
        }
      });
    })();
    return () => {
      mounted = false;
    };
  }, [store]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (syncing.current) return;
      syncing.current = true;
      try {
        const list = Object.values(store.items);
        await Promise.all(list.map((it) => updateItem(it.variantId, it.quantity)));
      } finally {
        syncing.current = false;
      }
    }, 400);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [store.items]);

  return <>{children}</>;
}
