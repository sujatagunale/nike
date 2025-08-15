import React from "react";
import { Star } from "lucide-react";

export default function ProductMeta({
  title,
  subtitle,
  price,
  compareAtPrice,
  description,
  badges = [],
  rating,
}: {
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  badges?: string[];
  rating?: number;
}) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPct =
    hasDiscount ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : null;

  return (
    <div className="space-y-4">
      {badges?.length ? (
        <div className="flex gap-2">
          {badges.map((b) => (
            <span key={b} className="bg-light-200 text-dark-900 px-3 py-1 rounded-full font-jost text-caption">
              {b}
            </span>
          ))}
        </div>
      ) : null}

      <div>
        <h1 className="font-jost text-heading-3 font-medium text-dark-900">{title}</h1>
        {subtitle ? (
          <p className="font-jost text-caption text-dark-700 mt-1">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <p className="font-jost text-lead font-medium text-dark-900">${price}</p>
        {hasDiscount ? (
          <>
            <span className="font-jost text-body text-dark-700 line-through">${compareAtPrice}</span>
            <span className="font-jost text-caption text-green">Extra {discountPct}% off</span>
          </>
        ) : null}
      </div>

      {typeof rating === "number" ? (
        <div className="flex items-center gap-1 text-dark-900">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-dark-900" : ""}`} />
          ))}
        </div>
      ) : null}

      <div className="pt-2 border-t border-light-300">
        <h2 className="font-jost text-body-medium font-medium text-dark-900 mb-2">Product Details</h2>
        <p className="font-jost text-body text-dark-700">{description}</p>
      </div>
    </div>
  );
}
