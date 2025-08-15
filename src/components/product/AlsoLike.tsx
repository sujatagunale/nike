import React from "react";
import Link from "next/link";
import Card from "@/components/Card";

export default function AlsoLike({
  items,
}: {
  items: Array<{ id: string; title: string; price: number; image: string }>;
}) {
  const valid = (src: string) =>
    src && [".jpg", ".jpeg", ".png", ".webp", ".avif"].some((e) => src.toLowerCase().endsWith(e));

  const clean = items.filter((i) => i && i.id && i.title && typeof i.price === "number" && valid(i.image));

  if (!clean.length) return null;

  return (
    <section className="mt-16">
      <h3 className="font-jost text-heading-3 font-medium text-dark-900 mb-6">You Might Also Like</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clean.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="block">
            <Card title={p.title} category="Men's Shoes" price={p.price} image={p.image} colors={1} />
          </Link>
        ))}
      </div>
    </section>
  );
}
