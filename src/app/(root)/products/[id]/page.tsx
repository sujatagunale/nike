import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Gallery from "./Gallery";
import PDPClient from "./PDPClient";
import Card from "@/components/Card";
import { getProduct, getRecommendedProducts } from "@/lib/actions/product";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function Recommended({ productId }: { productId: string }) {
  const items = await getRecommendedProducts(productId, 6);
  if (!items.length) return null;
  return (
    <section className="mt-16">
      <h2 className="font-jost text-heading-3 text-dark-900 mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`}>
            <Card
              title={p.name}
              category={p.category.name}
              price={p.minPrice}
              image={p.imageUrl || "/shoes/shoe-1.jpg"}
              colors={p.colorCount}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const badge = "Highly Rated";


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-light-300 px-3 py-1 font-jost text-caption">
              <span className="size-2 rounded-full bg-green-500" />
              {badge}
            </span>
          </div>
          <Gallery images={product.images} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-jost text-heading-3 text-dark-900">{product.name}</h1>
            <p className="font-jost text-caption text-dark-700">{product.gender.label}&apos;s Shoes</p>
          </div>

          <div className="flex items-center gap-3">
            {product.images.slice(0, 5).map((img) => (
              <div key={img.id} className="relative h-16 w-16 rounded border border-light-300 overflow-hidden">
                <Image src={img.url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>

          <PDPClient
            variants={product.variants.map((v) => ({
              id: v.id,
              price: v.price,
              salePrice: v.salePrice,
              inStock: v.inStock,
              size: v.size,
            }))}
          />

          <section className="pt-4 border-t border-light-300">
            <h3 className="font-jost text-body-medium text-dark-900 mb-2">Product Details</h3>
            <p className="font-jost text-body text-dark-700 mb-3">
              {product.description ?? "Details unavailable."}
            </p>
            <ul className="list-disc pl-6 space-y-1 font-jost text-body text-dark-700">
              <li>Padded collar</li>
              <li>Foam midsole</li>
              <li>Shown: Various colorways</li>
              <li>Style: {product.id.slice(0, 8).toUpperCase()}</li>
            </ul>
          </section>

          <section className="border-t border-light-300 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Shipping &amp; Returns</h3>
              <span className="font-jost text-body text-dark-700">⌄</span>
            </div>
          </section>

          <section className="border-t border-light-300 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Reviews (10)</h3>
              <span className="font-jost text-body text-dark-700">★★★★★</span>
            </div>
          </section>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[430px] rounded-lg bg-light-200 animate-pulse" />
            ))}
          </div>
        }
      >
        <Recommended productId={product.id} />
      </Suspense>
    </div>
  );
}
