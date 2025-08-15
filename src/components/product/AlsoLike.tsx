import React from "react";
import Card from "@/components/Card";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  colors?: number;
};

export default function AlsoLike({ items }: { items: Item[] }) {
  const list = items.filter((i) => Boolean(i.image));
  if (!list.length) return null;
  return (
    <section aria-labelledby="also-like" className="mt-16">
      <h2 id="also-like" className="font-jost text-heading-3 text-dark-900 mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="block">
            <Card
              title={p.title}
              category={p.category}
              price={p.price}
              image={p.image}
              colors={p.colors}
              badge={p.badge}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
