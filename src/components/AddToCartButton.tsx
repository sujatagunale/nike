"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { addItem as addServerItem } from "@/lib/actions/cart";
import { useCart } from "@/lib/store/cart";

type VariantInput = {
  id: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string | null;
};

export default function AddToCartButton({ variant }: { variant: VariantInput }) {
  const [pending, setPending] = useState(false);
  const cart = useCart();
  return (
    <button
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          cart.addItem(
            {
              variantId: variant.id,
              productId: variant.productId,
              name: variant.name,
              color: variant.color,
              size: variant.size,
              price: variant.price,
              image: variant.image ?? null,
            },
            1
          );
          await addServerItem(variant.id, 1);
        } finally {
          setPending(false);
        }
      }}
      className="flex-1 min-h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium flex items-center justify-center gap-2"
    >
      <ShoppingBag className="h-5 w-5" />
      {pending ? "Adding..." : "Add to Bag"}
    </button>
  );
}
