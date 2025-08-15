"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { MockProduct, mockProducts } from "@/lib/data/products";

type DetailsClientProps = {
  product: MockProduct;
  gallerySrcs: string[];
};

export default function DetailsClient({ product, gallerySrcs }: DetailsClientProps) {
  const gallery = useMemo(() => gallerySrcs, [gallerySrcs]);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="order-1 lg:order-none">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-light-200">
            <Image
              src={gallery[activeIdx]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                aria-label={`View image ${i + 1}`}
                onClick={() => setActiveIdx(i)}
                className={`relative aspect-square rounded-lg overflow-hidden ring-2 ${
                  i === activeIdx ? "ring-dark-900" : "ring-transparent"
                } hover:ring-dark-700`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="order-2 lg:order-none">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-jost text-heading-3 text-dark-900">
                {product.name}
              </h1>
              <p className="mt-1 font-jost text-caption text-dark-700">
                {product.category}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-jost text-lead text-dark-900">
              ${product.price.toFixed(2)}
            </p>
            <p className="font-jost text-caption text-green mt-1">
              Extra 20% off w/ code SPORT
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            {gallery.slice(0, 5).map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Select style ${i + 1}`}
                className={`relative h-16 w-16 rounded-lg overflow-hidden border ${
                  i === activeIdx ? "border-dark-900" : "border-light-300"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="font-jost text-body-medium text-dark-900">
                Select Size
              </p>
              <button className="font-jost text-caption text-dark-700 underline">
                Size Guide
              </button>
            </div>

            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                "5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5",
              ].map((s) => (
                <button
                  key={s}
                  className="py-3 rounded-lg border border-light-300 hover:border-dark-900 font-jost text-caption text-dark-900"
                  aria-label={`Size ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full py-4 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium">
              Add to Bag
            </button>
            <div className="w-full py-4 rounded-full border border-light-300 text-center font-jost text-body-medium">
              Favorite
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <div className="w-full flex items-center justify-between py-4 border-b border-light-300">
                <span className="font-jost text-body-medium text-dark-900">
                  Product Details
                </span>
                <span>⌄</span>
              </div>
              <div className="mt-3 font-jost text-body text-dark-700">
                <p className="mb-3">
                  The Air Max 90 stays true to its running roots with the iconic
                  Waffle sole. Complete with romantic hues, its visible Air
                  cushioning adds comfort to your journey.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Padded collar</li>
                  <li>Foam midsole</li>
                  <li>Shown: Dark Team Red / Pure Platinum / White</li>
                  <li>Style: HM9451-600</li>
                </ul>
              </div>
            </div>

            <div className="w-full flex items-center justify-between py-4 border-b border-light-300">
              <span className="font-jost text-body-medium text-dark-900">
                Shipping &amp; Returns
              </span>
              <span>⌄</span>
            </div>

            <div className="w-full flex items-center justify-between py-4 border-b border-light-300">
              <span className="font-jost text-body-medium text-dark-900">
                Reviews (10)
              </span>
              <span>★★★★★ ⌄</span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-16">
        <h2 className="font-jost text-heading-3 text-dark-900 mb-6">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.slice(0, 3).map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="block">
              <Card
                title={p.name}
                category={p.category}
                price={p.price}
                image={p.image}
                colors={p.colors.length}
                badge={p.badge}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
