import Image from "next/image";
import { Star, Heart, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Card from "@/components/Card";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const images = ["/shoes/shoe-1.jpg", "/shoes/shoe-2.jpg", "/shoes/shoe-3.jpg", "/shoes/shoe-4.jpg", "/shoes/shoe-5.jpg"];
  const sizes = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[520px_1fr] gap-8 lg:gap-12">
        <div className="flex gap-4">
          <div className="hidden lg:flex flex-col gap-3 w-20">
            {images.map((src, i) => (
              <button key={src} className={`relative h-20 w-20 rounded-lg overflow-hidden border ${i === 0 ? "border-dark-900" : "border-light-300"}`}>
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <div className="relative bg-light-200 rounded-xl p-4 min-h-[420px] lg:min-h-[560px] overflow-hidden">
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-2 bg-light-100 px-3 py-1 rounded-full font-jost text-caption text-dark-900 border border-light-300">
                  <Star className="h-4 w-4 fill-dark-900 text-dark-900" />
                  Highly Rated
                </span>
              </div>
              <Image src={images[0]} alt="Product" fill className="object-contain" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button className="h-9 w-9 rounded-full bg-light-100 border border-light-300 grid place-items-center">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full bg-light-100 border border-light-300 grid place-items-center">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="lg:hidden flex items-center gap-3 mt-3 overflow-x-auto">
              {images.map((src, i) => (
                <button key={src} className={`relative h-16 w-16 rounded-lg overflow-hidden border shrink-0 ${i === 0 ? "border-dark-900" : "border-light-300"}`}>
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-jost text-heading-3 text-dark-900">Nike Air Max 90 SE</h1>
            <p className="font-jost text-dark-700">Women&apos;s Shoes</p>
            <div className="mt-3">
              <p className="font-jost text-heading-3 text-dark-900">$140</p>
              <p className="font-jost text-caption text-green mt-1">Extra 20% off w/ code SPORT</p>
            </div>
          </div>

          <div className="flex gap-3">
            {images.slice(0, 5).map((src, i) => (
              <button key={src} className={`relative h-16 w-24 rounded-lg overflow-hidden border ${i === 3 ? "border-dark-900" : "border-light-300"}`}>
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-jost text-body-medium text-dark-900">Select Size</span>
              <span className="font-jost text-caption text-dark-700">Size Guide</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {sizes.map((s, i) => {
                const disabled = i >= 10;
                return (
                  <button
                    key={s}
                    disabled={disabled}
                    className={`h-11 rounded-lg border font-jost text-body ${disabled ? "text-dark-500 border-light-300 cursor-not-allowed" : "border-light-300 hover:border-dark-900"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium">Add to Bag</button>
            <button className="w-full h-12 rounded-full border border-light-300 font-jost text-body-medium text-dark-900 flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" /> Favorite
            </button>
          </div>

          <section className="divide-y divide-light-300 border-y border-light-300">
            <div className="py-5">
              <div className="flex items-center justify-between">
                <h3 className="font-jost text-body-medium text-dark-900">Product Details</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
              <p className="mt-3 font-jost text-body text-dark-700">
                The Air Max 90 stays true to its running roots with the iconic Waffle sole. Stitched overlays and textured accents create the &apos;90s look. Its visible Air cushioning adds comfort.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 font-jost text-body text-dark-900">
                <li>Padded collar</li>
                <li>Foam midsole</li>
                <li>Shown: Dark Team Red/Platinum Tint/Pure Platinum/White</li>
                <li>Style: HM9451-600</li>
              </ul>
            </div>
            <div className="py-5 flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Shipping &amp; Returns</h3>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="py-5 flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Reviews (10)</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-dark-900 text-dark-900" />
                <Star className="h-4 w-4 fill-dark-900 text-dark-900" />
                <Star className="h-4 w-4 fill-dark-900 text-dark-900" />
                <Star className="h-4 w-4 fill-dark-900 text-dark-900" />
                <Star className="h-4 w-4 text-dark-900" />
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-jost text-heading-3 text-dark-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Nike Air Force 1 Mid '07" category="Men's Shoes" price={98.3} image="/shoes/shoe-2.jpg" badge="Best Seller" href={`/products/${id}-1`} />
          <Card title="Nike Court Vision Low Next Nature" category="Men's Shoes" price={98.3} image="/shoes/shoe-3.jpg" href={`/products/${id}-2`} />
          <Card title="Nike Dunk Low Retro" category="Men's Shoes" price={98.3} image="/shoes/shoe-4.jpg" href={`/products/${id}-3`} />
        </div>
      </section>
    </div>
  );
}
