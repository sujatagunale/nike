import Image from "next/image";
import Card from "@/components/Card";
import { mockProducts } from "@/lib/data/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id) ?? mockProducts[0];

  const gallery = [
    product.image,
    "/shoes/shoe-2.webp",
    "/shoes/shoe-3.webp",
    "/shoes/shoe-6.avif",
    "/shoes/shoe-5.avif",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-[72px_1fr] gap-4">
          <div className="hidden lg:flex flex-col gap-3">
            {gallery.slice(0, 6).map((src, i) => (
              <div
                key={i}
                className="relative w-[72px] h-[72px] rounded-md overflow-hidden ring-1 ring-light-300 bg-light-200"
              >
                <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="bg-light-200 rounded-xl p-4">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-light-100">
              <Image src={gallery[0]} alt={product.name} fill className="object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button aria-label="Previous" className="h-9 w-9 rounded-full bg-light-100 ring-1 ring-light-300 text-dark-900">
                ‹
              </button>
              <button aria-label="Next" className="h-9 w-9 rounded-full bg-light-100 ring-1 ring-light-300 text-dark-900">
                ›
              </button>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-jost text-heading-3 text-dark-900">{product.name}</h1>
          <p className="mt-1 font-jost text-caption text-dark-700">{product.category}</p>

          <div className="mt-4">
            <p className="font-jost text-heading-3 text-dark-900">${product.price.toFixed(2)}</p>
            <p className="mt-1 font-jost text-caption text-green">Extra 20% off w/ code SPORT</p>
          </div>

          <div className="mt-6 flex gap-3 lg:hidden">
            {gallery.slice(0, 5).map((src, i) => (
              <div
                key={i}
                className="relative w-16 h-16 rounded-md overflow-hidden ring-1 ring-light-300 bg-light-200"
              >
                <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="font-jost text-body-medium text-dark-900">Select Size</p>
            <button className="font-jost text-caption text-dark-700 underline">Size Guide</button>
          </div>

          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {product.sizes.slice(0, 12).map((s) => (
              <button
                key={s}
                className="h-12 rounded-lg ring-1 ring-light-300 font-jost text-body text-dark-900 hover:ring-dark-700"
              >
                {s}
              </button>
            ))}
          </div>

          <button className="mt-6 w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium">
            Add to Bag
          </button>
          <button className="mt-3 w-full h-12 rounded-full ring-1 ring-dark-900 text-dark-900 font-jost text-body-medium">
            ♡ Favorite
          </button>

          <div className="mt-8">
            <section className="py-4 border-t border-light-300">
              <div className="flex items-center justify-between">
                <h3 className="font-jost text-body-medium text-dark-900">Product Details</h3>
                <span className="text-dark-700">⌄</span>
              </div>
              <p className="mt-3 font-jost text-body text-dark-700">
                The Air Max 90 stays true to its running roots with the iconic Waffle sole. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.
              </p>
              <ul className="mt-3 list-disc pl-6 font-jost text-body text-dark-900">
                <li>Padded collar</li>
                <li>Foam midsole</li>
                <li>Shown: Dark Team Red/Platinum Tint/Pure Platinum/White</li>
                <li>Style: HM9451-600</li>
              </ul>
            </section>

            <section className="py-4 border-t border-light-300 flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Shipping &amp; Returns</h3>
              <span className="text-dark-700">⌄</span>
            </section>

            <section className="py-4 border-t border-light-300 flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Reviews (10)</h3>
              <span className="text-dark-700">★★★★★ ⌄</span>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-jost text-body-medium text-dark-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((p) => (
              <Card
                key={p.id}
                title={p.name}
                category={p.category}
                price={p.price}
                image={p.image}
                colors={p.colors.length}
                badge={p.badge}
                href={`/products/${p.id}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
