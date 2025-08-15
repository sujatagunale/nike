import { Suspense } from "react";
import Image from "next/image";
import { getProduct } from "@/lib/actions/product";
import ReviewsSection from "@/components/product/ReviewsSection";
import AlsoLikeServer from "@/components/product/AlsoLikeServer";
import ReviewsSkeleton from "@/components/product/ReviewsSkeleton";
import AlsoLikeSkeleton from "@/components/product/AlsoLikeSkeleton";

type PageProps = {
  params: { id: string };
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-24">
        <div className="mx-auto max-w-md text-center border border-dark-100 rounded-xl p-8 bg-light-100">
          <h1 className="font-jost text-heading-3 text-dark-900">Product not found</h1>
          <p className="mt-2 text-body text-dark-600">We couldn&apos;t find what you were looking for.</p>
        </div>
      </div>
    );
  }

  const images = product.images
    .filter((img) => !!img.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);

  const prices = product.variants.map((v) => v.salePrice ?? v.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;

  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color.id, v.color])).values()
  );
  const sizes = Array.from(new Map(product.variants.map((v) => [v.size.id, v.size])).values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {images.length ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-dark-50">
                <Image
                  src={images[0]!.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((img) => (
                    <div key={img.id} className="relative aspect-square rounded bg-dark-50 overflow-hidden">
                      <Image
                        src={img.url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1024px) 25vw, 12vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="font-jost text-heading-2 text-dark-900">{product.name}</h1>
          <div className="mt-2 text-body text-dark-600">
            {product.brand.name} • {product.category.name}
          </div>
          <div className="mt-4 font-jost text-heading-3 text-dark-900">${minPrice.toFixed(2)}</div>

          {!!colors.length && (
            <div className="mt-6">
              <div className="font-jost text-body text-dark-900 mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span
                    key={c.id}
                    className="w-8 h-8 rounded-full border border-dark-200"
                    style={{ backgroundColor: c.hexCode }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {!!sizes.length && (
            <div className="mt-6">
              <div className="font-jost text-body text-dark-900 mb-2">Size</div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {sizes
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="text-center border border-dark-200 rounded-md py-2 text-body text-dark-800"
                    >
                      {s.name}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="font-jost text-heading-4 text-dark-900 mb-2">Description</h2>
              <p className="text-body text-dark-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection productId={product.id} />
      </Suspense>

      <Suspense fallback={<AlsoLikeSkeleton />}>
        <AlsoLikeServer productId={product.id} />
      </Suspense>
    </div>
  );
}
