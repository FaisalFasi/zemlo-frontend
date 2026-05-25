import ShopEmptyState from "./ShopEmptyState";
import ShopProductCard from "./ShopProductCard";

import type { ShopProduct } from "../types/shop.types";

type ShopProductGridProps = {
  products: ShopProduct[];
  hasFilters: boolean;
};

export default function ShopProductGrid({
  products,
  hasFilters,
}: ShopProductGridProps) {
  if (products.length === 0) {
    return <ShopEmptyState hasFilters={hasFilters} />;
  }

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ShopProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
