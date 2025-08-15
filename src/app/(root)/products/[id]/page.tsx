import AlsoLike from "@/components/product/AlsoLike";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { productById, alsoLike } from "@/lib/mocks/productById";
import { parseIdParam } from "@/lib/utils/ids";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const p = productById(parseIdParam((await params).id) ?? "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      {!p ? (
        <div className="py-20 text-center">
          <p className="font-jost text-body text-dark-700">Product not found.</p>
        </div>
      ) : (
        <>
          <ProductDetailClient product={p} />
          <AlsoLike items={alsoLike()} />
        </>
      )}
    </div>
  );
}
