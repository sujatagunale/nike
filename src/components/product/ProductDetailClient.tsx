"use client";

import React, { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ProductMeta from "./ProductMeta";

type Variant = { id: string; name: string; colorHex: string; images: string[] };
type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  variants: Variant[];
  sizes: string[];
  badges?: string[];
  rating?: number;
};

function sanitize(arr: string[]) {
  const set = new Set<string>();
  const out: string[] = [];
  for (const src of arr || []) {
    if (!src) continue;
    const s = src.trim();
    if (!s) continue;
    const lowered = s.toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].some((e) => lowered.endsWith(e))) continue;
    if (!set.has(s)) {
      set.add(s);
      out.push(s);
    }
  }
  return out;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants?.[0]?.id ?? null
  );

  const galleryImages = useMemo(() => {
    const current =
      product.variants.find((v) => v.id === selectedVariant)?.images || product.images;
    const cleaned = sanitize(current);
    return cleaned.length ? cleaned : sanitize(product.images);
  }, [product.images, product.variants, selectedVariant]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <ProductGallery images={galleryImages} />

      <div className="space-y-6">
        <ProductMeta
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          description={product.description}
          badges={product.badges}
          rating={product.rating}
        />

        <ColorPicker
          variants={product.variants}
          value={selectedVariant}
          onChange={(id) => setSelectedVariant(id)}
        />

        <SizePicker sizes={product.sizes} />
      </div>
    </div>
  );
}
