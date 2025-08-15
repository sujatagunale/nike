"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Card from "@/components/Card";

const GALLERY = [
  "/shoes/shoe-1.jpg",
  "/shoes/shoe-2.jpg",
  "/shoes/shoe-3.jpg",
  "/shoes/shoe-4.jpg",
  "/shoes/shoe-5.jpg",
  "/shoes/shoe-6.jpg",
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-light-200 text-dark-900 px-3 py-1 rounded-full font-jost text-caption">
      {children}
    </span>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
  rightAddon,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  rightAddon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-light-300">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 focus:outline-none focus:ring-2 focus:ring-dark-700 rounded"
        aria-expanded={open}
      >
        <span className="font-jost text-body-medium text-dark-900">{title}</span>
        <div className="flex items-center gap-3">
          {rightAddon}
          <span className="text-dark-700">{open ? "▴" : "▾"}</span>
        </div>
      </button>
      {open && (
        <div className="pb-6">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailsPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(1);
  const [activeSize, setActiveSize] = useState<number | null>(null);

  const sizes = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
  const disabled = new Set<number>([10, 10.5, 11.5, 12]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="lg:pl-4">
          <div className="grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-4">
            {/* Thumbnails - desktop (vertical) */}
            <div className="hidden sm:flex sm:flex-col gap-3">
              {GALLERY.map((src, i) => (
                <button
                  key={src}
                  aria-selected={activeImage === i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 rounded-md overflow-hidden bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-700 ${activeImage === i ? "ring-2 ring-dark-900" : "ring-1 ring-light-300"}`}
                >
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative rounded-lg bg-light-200 overflow-hidden">
              <div className="absolute top-4 left-4">
                <Badge>Highly Rated</Badge>
              </div>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={GALLERY[activeImage]}
                  alt="Product image"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Thumbnails - mobile (horizontal) */}
          <div className="sm:hidden mt-4">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {GALLERY.map((src, i) => (
                <button
                  key={src}
                  aria-selected={activeImage === i}
                  onClick={() => setActiveImage(i)}
                  className={`relative shrink-0 h-16 w-16 rounded-md overflow-hidden bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-700 ${activeImage === i ? "ring-2 ring-dark-900" : "ring-1 ring-light-300"}`}
                >
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="font-jost text-heading-3 text-dark-900">Nike Air Max 90 SE</h1>
          <p className="font-jost text-body text-dark-700 mt-1">Women&apos;s Shoes</p>

          <div className="mt-4">
            <p className="font-jost text-lead text-dark-900">$140</p>
            <p className="font-jost text-caption text-green mt-1">Extra 20% off w/ code SPORT</p>
          </div>

          {/* Colorway previews */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((c) => (
                <button
                  key={c}
                  aria-label={`Color ${c}`}
                  aria-selected={activeColor === c}
                  onClick={() => setActiveColor(c)}
                  className={`h-14 w-14 rounded-md bg-light-200 border ${activeColor === c ? "border-dark-900" : "border-light-300"} focus:outline-none focus:ring-2 focus:ring-dark-700`}
                >
                  <div className="relative h-full w-full">
                    <Image src={`/shoes/shoe-${((c - 1) % GALLERY.length) + 1}.jpg`} alt={`Color ${c}`} fill className="object-cover rounded-md" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="font-jost text-body-medium text-dark-900">Select Size</p>
              <button className="font-jost text-caption text-dark-700 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-dark-700 rounded px-2 py-1">
                Size Guide
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {sizes.map((s) => {
                const isDisabled = disabled.has(s);
                const selected = activeSize === s;
                return (
                  <button
                    key={s}
                    aria-selected={selected}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setActiveSize(s)}
                    className={[
                      "h-12 rounded-md border font-jost text-body",
                      "focus:outline-none focus:ring-2 focus:ring-dark-700",
                      selected ? "border-dark-900" : "border-light-300",
                      isDisabled ? "bg-light-200 text-dark-700 cursor-not-allowed" : "bg-light-100 text-dark-900",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button className="w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium">
              Add to Bag
            </button>
            <button className="w-full h-12 rounded-full border border-light-300 font-jost text-body-medium">
              ♡ Favorite
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-8">
            <Accordion title="Product Details" defaultOpen>
              <p className="font-jost text-body text-dark-700">
                The Air Max 90 stays true to its running roots with the iconic Waffle sole.
                Stitched overlays and textured accents create the &apos;90s look you love.
                Complete with romantic hues, its visible Air cushioning adds comfort to your journey.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-1 font-jost text-body text-dark-900">
                <li>Padded collar</li>
                <li>Foam midsole</li>
                <li>Shown: Dark Team Red/Platinum Tint/Pure Platinum/White</li>
                <li>Style: HM9451-600</li>
              </ul>
            </Accordion>

            <Accordion title="Shipping & Returns" />
            <Accordion title="Reviews (10)" rightAddon={<span className="text-dark-900">★★★★★</span>} />
          </div>
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="mt-16">
        <h2 className="font-jost text-heading-3 text-dark-900">You Might Also Like</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/products/${i + 1}`} className="block">
              <Card
                title={i === 1 ? "Nike Court Vision Low Next Nature" : i === 2 ? "Nike Dunk Low Retro" : "Nike Air Force 1 Mid '07"}
                category="Men's Shoes"
                price={98.3}
                image={`/shoes/shoe-${i + 1}.jpg`}
                colors={i === 0 ? 6 : 4}
                badge={i === 0 ? "Best Seller" : "Extra 20% off"}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
