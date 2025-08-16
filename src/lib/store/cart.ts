"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type State = {
  items: Record<string, CartItem>;
};

type Actions = {
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export type CartStore = State & {
  totalItems: number;
  subtotal: number;
} & Actions;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      get totalItems() {
        return Object.values(get().items).reduce((s, i) => s + i.quantity, 0);
      },
      get subtotal() {
        return Object.values(get().items).reduce((s, i) => s + i.price * i.quantity, 0);
      },
      addItem: (item, qty = 1) =>
        set((state) => {
          const current = state.items[item.variantId];
          const nextQty = (current?.quantity ?? 0) + qty;
          return {
            items: {
              ...state.items,
              [item.variantId]: { ...item, quantity: nextQty },
            },
          };
        }),
      removeItem: (variantId) =>
        set((state) => {
          const { [variantId]: _, ...rest } = state.items;
          return { items: rest };
        }),
      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const { [variantId]: _, ...rest } = state.items;
            return { items: rest };
          }
          const cur = state.items[variantId];
          if (!cur) return state;
          return { items: { ...state.items, [variantId]: { ...cur, quantity } } };
        }),
      clear: () => set({ items: {} }),
    }),
    { name: "nike-cart-v1" }
  )
);
