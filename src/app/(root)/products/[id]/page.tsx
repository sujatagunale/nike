"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImageOff,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Heart,
} from "lucide-react";
import Card from "@/components/Card";

type Reco = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  colors?: number;
};

type ProductColor = {
  name: string;
  images: string[];
  swatch?: string;
};

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  discountPercent?: number;
  description?: string;
  specs?: string[];
  images: string[];
  colors?: ProductColor[];
  recommendations: Reco[];
};

function getMockProduct(id: string): Product {
  const baseImages = [
    "/shoes/shoe-1.jpg",
    "/shoes/shoe-2.jpg",
    "/shoes/shoe-3.jpg",
    "/shoes/shoe-4.jpg",
    "/shoes/shoe-5.jpg",
  ];
  const colors: ProductColor[] = [
    { name: "Pink", images: ["/shoes/shoe-1.jpg", "/shoes/shoe-2.jpg"] },
    { name: "Grey", images: ["/shoes/shoe-3.jpg", "/shoes/shoe-4.jpg"] },
    { name: "Red", images: ["/shoes/shoe-5.jpg"] },
    { name: "Broken", images: ["", " ", "/does-not-exist.jpg"] },
  ];
  const recos: Reco[] = [
    {
      id: "101",
      title: "Nike Air Force 1 Mid '07",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-2.jpg",
      badge: "Best Seller",
      colors: 6,
    },
    {
      id: "102",
      title: "Nike Court Vision Low Next Nature",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-3.jpg",
      badge: "Extra 20% off",
      colors: 4,
    },
    {
      id: "103",
      title: "Nike Dunk Low Retro",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-4.jpg",
      badge: "Extra 10% off",
      colors: 6,
    },
  ];
  return {
    id,
    title: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    discountPercent: 20,
    description:
      "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Plus, stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.",
    specs: [
      "Padded collar",
      "Foam midsole",
      "Shown: Dark Team Red/Platinum Tint/Pure Platinum/White",
      "Style: HM9451-600",
    ],
    images: baseImages,
    colors,
    recommendations: recos,
  };
}

function useGallery(images: string[]) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const valid = useMemo(
    () => images.filter((u) => !!u && u.trim().length > 0 && !hidden.has(u)),
    [images, hidden]
  );
  const [mainIdx, setMainIdx] = useState(0);
  useEffect(() => {
    setMainIdx(0);
  }, [images.length]);
  useEffect(() => {
    if (mainIdx >= valid.length) setMainIdx(0);
  }, [mainIdx, valid.length]);
  const onError = useCallback((src: string) => {
    setHidden((prev) => {
      const n = new Set(prev);
      n.add(src);
      return n;
    });
  }, []);
  return { valid, mainIdx, setMainIdx, onError };
}

export default function ProductDetails({
  params,
}: {
  params: { id: string };
}) {
  const product = useMemo(() => getMockProduct(params.id), [params.id]);

  const availableColors = useMemo(
    () =>
      (product.colors || []).filter(
        (c) => (c.images || []).filter((u) => !!u && u.trim().length > 0).length
      ),
    [product.colors]
  );
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  useEffect(() => {
    if (activeColorIdx >= availableColors.length) setActiveColorIdx(0);
  }, [activeColorIdx, availableColors.length]);

  const colorImages =
    availableColors[activeColorIdx]?.images?.length
      ? availableColors[activeColorIdx].images
      : product.images;

  const { valid, mainIdx, setMainIdx, onError } = useGallery(colorImages);
  const hasImages = valid.length > 0;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="grid grid-cols-[84px_1fr] gap-4">
            <div className="flex lg:flex-col gap-2">
              {loading ? (
                <div className="flex lg:flex-col gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 bg-light-200 rounded-md animate-pulse"
                    />
                  ))}
                </div>
              ) : hasImages ? (
                valid.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setMainIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setMainIdx(i);
                    }}
                    aria-label={`Thumbnail ${i + 1}`}
                    aria-pressed={i === mainIdx}
                    tabIndex={0}
                    className={`relative h-20 w-20 overflow-hidden rounded-md ring-1 ring-light-300 focus:outline-none focus-visible:ring-2 ${
                      i === mainIdx ? "ring-dark-900" : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.title} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      onError={() => onError(src)}
                    />
                  </button>
                ))
              ) : null}
            </div>

            <div className="relative rounded-lg bg-light-200 overflow-hidden">
              {loading ? (
                <div className="aspect-[4/3] w-full animate-pulse" />
              ) : hasImages ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={valid[mainIdx]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={() => onError(valid[mainIdx])}
                    priority
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-light-100/80 backdrop-blur ring-1 ring-light-300 flex items-center justify-center"
                      onClick={() =>
                        setMainIdx((p) => (p - 1 + valid.length) % valid.length)
                      }
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 text-dark-900" />
                    </button>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-light-100/80 backdrop-blur ring-1 ring-light-300 flex items-center justify-center"
                      onClick={() => setMainIdx((p) => (p + 1) % valid.length)}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4 text-dark-900" />
                    </button>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-light-100/80 backdrop-blur ring-1 ring-light-300 flex items-center justify-center"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="h-4 w-4 text-dark-900" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] w-full flex items-center justify-center bg-light-200">
                  <ImageOff className="h-10 w-10 text-dark-700" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-jost text-heading-3 text-dark-900">
              {product.title}
            </h1>
            <p className="font-jost text-caption text-dark-700">
              {product.subtitle || "Shoes"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="font-jost text-lead font-medium text-dark-900">
                ${product.price.toFixed(0)}
              </p>
              {product.discountPercent ? (
                <span className="px-2 py-0.5 rounded-md bg-green text-light-100 font-jost text-footnote">
                  Extra {product.discountPercent}% off
                </span>
              ) : null}
            </div>

            {availableColors.length > 0 ? (
              <div className="space-y-2">
                <p className="font-jost text-caption text-dark-700">Colours</p>
                <div className="flex items-center gap-2">
                  {availableColors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveColorIdx(idx)}
                      aria-pressed={activeColorIdx === idx}
                      className={`px-3 py-1 rounded-md ring-1 ring-light-300 font-jost text-caption ${
                        activeColorIdx === idx
                          ? "bg-dark-900 text-light-100"
                          : "bg-light-100 text-dark-900"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium"
            >
              Add to Bag
            </button>
            <button
              type="button"
              className="w-full h-12 rounded-full bg-light-100 ring-1 ring-light-300 font-jost text-body-medium text-dark-900 flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Favorite
            </button>
          </div>

          <div className="pt-2 border-t border-light-300 space-y-4">
            <h2 className="font-jost text-body-medium text-dark-900">
              Product Details
            </h2>
            <p className="font-jost text-body text-dark-700">{product.description}</p>
            <ul className="list-disc pl-6 space-y-1">
              {(product.specs || []).map((s) => (
                <li key={s} className="font-jost text-body text-dark-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="mt-16">
        <h3 className="font-jost text-body-medium text-dark-900 mb-6">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.recommendations.map((r) => (
            <Card
              key={r.id}
              title={r.title}
              category={r.category}
              price={r.price}
              image={r.image}
              badge={r.badge}
              colors={r.colors}
              href={`/products/${r.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
