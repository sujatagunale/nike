import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import AlsoLike from "@/components/product/AlsoLike";
import { assertProductOrNotFound } from "@/lib/mocks/productById";
import { parseIdParam } from "@/lib/utils/ids";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = parseIdParam(params?.id);
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-light-300 p-8 text-center">
          <p className="font-jost text-body text-dark-700">Product not found.</p>
          <Link href="/products" className="font-jost text-body-medium text-dark-900 underline mt-2 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const product = assertProductOrNotFound(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailClient product={product} />

      <div className="flex gap-3 mt-6 lg:mt-8">
        <button className="flex-1 h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium flex items-center justify-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Add to Bag
        </button>
        <button className="flex-1 h-12 rounded-full border border-light-400 font-jost text-body-medium flex items-center justify-center gap-2">
          <Heart className="h-5 w-5" />
          Favorite
        </button>
      </div>

      <AlsoLike items={product.alsoLike} />
    </div>
  );
}
