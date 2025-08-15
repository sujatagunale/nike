import React from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  rating?: number;
};

export default function ProductMeta({ title, subtitle, price, compareAt, rating }: Props) {
  const hasDiscount = compareAt && compareAt > price;
  const pct = hasDiscount ? Math.round(((compareAt! - price) / compareAt!) * 100) : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-jost text-heading-3 text-dark-900">{title}</h1>
        {subtitle && (
          <p className="font-jost text-body text-dark-700">{subtitle}</p>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-jost text-lead text-dark-900">${price}</span>
          {hasDiscount && (
            <>
              <span className="font-jost text-body text-dark-700 line-through">
                ${compareAt!.toFixed(0)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-green text-light-100 font-jost text-footnote">
                {pct}% off
              </span>
            </>
          )}
        </div>
        {rating && (
          <div className="mt-2 flex items-center gap-1 text-dark-900">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-jost text-caption">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button className="h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium flex items-center justify-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Add to Bag
        </button>
        <button className="h-12 rounded-full border border-light-300 font-jost text-body-medium flex items-center justify-center gap-2">
          <Heart className="h-5 w-5" />
          Favorite
        </button>
      </div>
    </div>
  );
}
