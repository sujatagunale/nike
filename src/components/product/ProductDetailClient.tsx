"use client";

import React, { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ProductMeta from "./ProductMeta";
import type { ProductMock, ProductVariant } from "@/lib/mocks/productById";

export default function ProductDetailClient({ product }: { product: ProductMock }) {
  const initial = useMemo<ProductVariant | undefined>(
    () => product.variants.find(v => v.images.filter(Boolean).length > 0),
    [product.variants]
  );
  const [active, setActive] = useState<ProductVariant | undefined>(initial);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <ProductGallery images={active?.images ?? []} title={product.title} />
      </div>

      <div className="space-y-6">
        <ProductMeta
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          compareAt={product.compareAt}
          rating={product.rating}
        />

        <ColorPicker variants={product.variants} onChange={setActive} />

        <SizePicker />

        <section>
          <h3 className="font-jost text-body-medium text-dark-900 mb-2">
            Product Details
          </h3>
          <p className="font-jost text-body text-dark-700">{product.description}</p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            {product.specs.map((s) => (
              <li key={s} className="font-jost text-body text-dark-700">
                {s}
              </li>
            ))}
          </ul>
        </section>

        <details className="border-t border-light-300 pt-4">
          <summary className="font-jost text-body-medium cursor-pointer">
            Shipping &amp; Returns
          </summary>
          <p className="mt-2 font-jost text-body text-dark-700">
            Free standard shipping on orders over $50. Returns accepted within 30 days.
          </p>
        </details>

        <details className="border-t border-light-300 pt-4">
          <summary className="font-jost text-body-medium cursor-pointer">
            Reviews (0)
          </summary>
          <p className="mt-2 font-jost text-body text-dark-700">No reviews yet.</p>
        </details>
      </div>
    </div>
  );
}
