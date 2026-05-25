import ShopFilters from "./components/ShopFilters";
import ShopProductGrid from "./components/ShopProductGrid";
import { filterAndSortShopProducts } from "./lib/shop-filters";
import type {
  ResolvedShopSearchParams,
  ShopCategoryFilter,
  ShopProduct,
} from "./types/shop.types";

type ShopPageProps = {
  products: ShopProduct[];
  categories: ShopCategoryFilter[];
  params: ResolvedShopSearchParams;
  isDemoCatalog: boolean;
};

export default function ShopPage({
  products,
  categories,
  params,
  isDemoCatalog,
}: ShopPageProps) {
  const visibleProducts = filterAndSortShopProducts(products, params);
  const hasFilters = Boolean(params.q || params.category);

  return (
    <main className="bg-background text-foreground">
      <section className="container-page py-10 md:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow text-muted-foreground">Zemlo shop</p>

            <h1 className="mt-3 text-section-title">
              Explore products across categories.
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Browse products from Zemlo and trusted brands. Filters are
              URL-based so search, category, and sort states stay shareable.
            </p>
          </div>

          {isDemoCatalog ? (
            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              Demo catalog mode
            </div>
          ) : null}
        </div>

        <ShopFilters
          categories={categories}
          params={params}
          totalProducts={products.length}
          visibleProducts={visibleProducts.length}
        />

        <div className="mt-10">
          <ShopProductGrid products={visibleProducts} hasFilters={hasFilters} />
        </div>
      </section>
    </main>
  );
}
