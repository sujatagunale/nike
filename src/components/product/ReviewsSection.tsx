"use server";

import { Star } from "lucide-react";
import { getProductReviews, type ReviewItem } from "@/lib/actions/product";

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < full ? "text-accent-500 fill-accent-500" : "text-dark-300"}
          size={16}
        />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: ReviewItem }) {
  return (
    <li className="border border-dark-100 rounded-lg p-4 bg-light-100">
      <div className="flex items-center justify-between">
        <div className="font-jost text-body text-dark-900">{r.author}</div>
        <Stars rating={r.rating} />
      </div>
      <div className="mt-1 text-caption text-dark-500">
        {new Date(r.createdAt).toLocaleDateString()}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer font-jost text-body text-dark-800">
          {r.title ?? "Read review"}
        </summary>
        <p className="mt-2 text-body text-dark-700 whitespace-pre-line">{r.content}</p>
      </details>
    </li>
  );
}

export default async function ReviewsSection({ productId }: { productId: string }) {
  const all = await getProductReviews(productId);
  const list = all.slice(0, 10).filter((r) => r.content || r.rating > 0);
  if (!list.length) return null;
  return (
    <section aria-labelledby="reviews" className="mt-16">
      <h2 id="reviews" className="font-jost text-heading-3 text-dark-900 mb-6">
        Reviews
      </h2>
      <ul className="space-y-4">
        {list.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </ul>
    </section>
  );
}
