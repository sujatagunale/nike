import Image from "next/image";
import Card from "@/components/Card";
import { mockProducts } from "@/lib/data/products";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const productName = "Nike Air Max 90 SE";
  const productCategory = "Women's Shoes";
  const productPrice = 140;
  const mainImage = "/shoes/shoe-6.avif";
  const gallery = [
    "/shoes/shoe-6.avif",
    "/shoes/shoe-5.avif",
    "/shoes/shoe-3.webp",
    "/shoes/shoe-2.webp",
    "/shoes/shoe-1.jpg",
  ];

  const related = mockProducts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="grid grid-cols-[4rem_1fr] gap-4">
          <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
            {gallery.map((src, i) => (
              <div
                key={i}
                className={`relative w-16 h-16 rounded-md overflow-hidden border ${
                  i === 0 ? "border-dark-900" : "border-light-300"
                }`}
              >
                <Image src={src} alt={`${productName} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="relative bg-light-200 rounded-xl overflow-hidden order-1 lg:order-2">
            <div className="absolute top-4 left-4">
              <span className="bg-light-100 text-dark-900 border border-light-300 px-3 py-1 rounded-full font-jost text-caption">
                Highly Rated
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full">
              <Image src={mainImage} alt={productName} fill className="object-cover" />
            </div>

            <div className="absolute inset-x-0 bottom-3 flex justify-end gap-2 px-3">
              <button
                aria-label="Previous"
                className="h-9 w-9 rounded-full bg-light-100 border border-light-300 text-dark-900"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                className="h-9 w-9 rounded-full bg-light-100 border border-light-300 text-dark-900"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h1 className="font-jost text-heading-3 text-dark-900">{productName}</h1>
            <p className="font-jost text-body text-dark-700">{productCategory}</p>
          </div>

          <div>
            <p className="font-jost text-lead text-dark-900">${productPrice}</p>
            <p className="font-jost text-caption text-green">Extra 20% off w/ code SPORT</p>
          </div>

          <div className="flex items-center gap-3">
            {gallery.slice(0, 5).map((src, i) => (
              <div
                key={i}
                className={`relative h-16 w-20 rounded-md overflow-hidden border ${
                  i === 0 ? "border-dark-900" : "border-light-300"
                }`}
              >
                <Image src={src} alt={`variant ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-jost text-body-medium text-dark-900">Select Size</p>
              <button className="font-jost text-caption text-dark-700 underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5"].map(
                (s, i) => (
                  <button
                    key={s}
                    className={`h-12 rounded-md border font-jost text-body ${
                      i === 2 ? "opacity-50 cursor-not-allowed border-light-300" : "border-dark-900 hover:bg-light-200"
                    }`}
                    aria-disabled={i === 2}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium">
              Add to Bag
            </button>
            <button className="w-full h-12 rounded-full bg-light-100 border border-light-300 font-jost text-body-medium">
              ♡ Favorite
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="font-jost text-body-medium text-dark-900">Product Details</h2>
            <p className="font-jost text-body text-dark-700">
              The Air Max 90 stays true to its running roots with the iconic Waffle sole. Complete
              with romantic textures and visible Air cushioning for comfort.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-dark-900 font-jost text-body">
              <li>Padded collar</li>
              <li>Foam midsole</li>
              <li>Shown: Dark Team Red/Pure Platinum/White</li>
              <li>Style: HM9451-600</li>
            </ul>
            <hr className="border-light-300" />
            <details>
              <summary className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900">
                Shipping &amp; Returns
              </summary>
              <p className="mt-2 font-jost text-body text-dark-700">
                Free standard shipping on orders over $50.
              </p>
            </details>
            <hr className="border-light-300" />
            <details>
              <summary className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900">
                Reviews (10)
              </summary>
              <p className="mt-2 font-jost text-body text-dark-700">★★★★★</p>
            </details>
          </div>
        </section>
      </div>

      <section className="mt-16">
        <h3 className="font-jost text-body-medium text-dark-900 mb-6">You Might Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {related.map((p) => (
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
    </div>
  );
}
