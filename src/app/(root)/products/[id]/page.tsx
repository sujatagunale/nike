import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/actions/product";
import Gallery from "@/components/product/Gallery";
import SizeSelector from "@/components/product/SizeSelector";
import RelatedProducts from "./RelatedProducts";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  const prices = product.variants.map((v) => v.salePrice ?? v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const hasSale = product.variants.some((v) => v.salePrice != null);

  const sizes = product.variants.map((v) => v.size);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10">
        <Gallery images={product.images} />
        <section>
          <h1 className="font-jost text-heading-3 text-dark-900">{product.name}</h1>
          <p className="font-jost text-caption text-dark-700 mt-1">
            {product.gender.label}&nbsp;·&nbsp;{product.category.name}
          </p>

          <div className="mt-4">
            <p className="font-jost text-lead text-dark-900">
              ${min.toFixed(0)}
              {min !== max ? ` - $${max.toFixed(0)}` : ""}
            </p>
            {hasSale && (
              <p className="font-jost text-caption text-green mt-1">
                Extra 20% off w/ code SPORT
              </p>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-jost text-body-medium text-dark-900">Select Size</span>
              <a className="font-jost text-caption text-dark-700" href="#">
                Size Guide
              </a>
            </div>
            <SizeSelector sizes={sizes} />
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-full bg-dark-900 text-light-100 px-6 py-4 font-jost text-body-medium">
              Add to Bag
            </button>
            <button className="w-full rounded-full border border-dark-900 px-6 py-4 font-jost text-body-medium">
              Favorite
            </button>
          </div>

          <div className="mt-8 border-t border-light-300 pt-6">
            <h3 className="font-jost text-body-medium text-dark-900 mb-2">Product Details</h3>
            <p className="font-jost text-body text-dark-700">
              {product.description ??
                "Premium construction with signature cushioning for all-day comfort."}
            </p>
            <ul className="mt-3 list-disc pl-6 text-dark-700 font-jost text-body">
              <li>Padded collar</li>
              <li>Foam midsole</li>
              <li>Shown: Multiple colors available</li>
              <li>Style: {product.variants[0]?.sku}</li>
            </ul>
          </div>

          <div className="mt-6 border-t border-light-300 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">Shipping &amp; Returns</h3>
              <span className="text-dark-700">▾</span>
            </div>
          </div>

          <div className="mt-6 border-t border-light-300 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-jost text-body-medium text-dark-900">
                Reviews (10)
              </h3>
              <span className="text-dark-700">★★★★★ ▾</span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="py-10 text-center font-jost text-body text-dark-700">
              Loading recommendations...
            </div>
          }
        >
          <RelatedProducts productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
