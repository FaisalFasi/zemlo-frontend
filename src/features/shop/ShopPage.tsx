import ShopFilters from "./components/ShopFilters";
import ShopPagination from "./components/ShopPagination";
import ShopProductGrid from "./components/ShopProductGrid";
import type {
  ResolvedShopSearchParams,
  ShopCategoryFilter,
  ShopProduct,
} from "./types/shop.types";

type ShopPageProps = {
  // Already filtered/sorted/paginated by the backend (or, in demo-catalog
  // mode, by the same logic applied to the local demo array) — this is
  // exactly what should render, not a raw list to filter here.
  products: ShopProduct[];
  total: number;
  pageCount: number;
  categories: ShopCategoryFilter[];
  params: ResolvedShopSearchParams;
  isDemoCatalog: boolean;
  // EXPLANATION: optional heading/description — category pages yehi
  // component reuse karte hain lekin SEO ke liye apni h1 chahiye
  // (e.g. category ka naam). Na dein to purana default text.
  heading?: string;
  description?: string;
  // Category pages keep search/sort/pagination on their own URL instead
  // of jumping to /shop — see ShopFilters/ShopPagination for how this is
  // used.
  basePath?: string;
};

export default function ShopPage({
  products,
  total,
  pageCount,
  categories,
  params,
  isDemoCatalog,
  heading = "Explore products across categories.",
  description = "Browse products from Zemlo and trusted brands. Filters are URL-based so search, category, and sort states stay shareable.",
  basePath = "/shop",
}: ShopPageProps) {
  const hasFilters = Boolean(params.q || params.category);

  return (
    <main className="bg-background text-foreground">
      <section className="container-page py-10 md:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow text-muted-foreground">Zemlo shop</p>

            <h1 className="mt-3 text-section-title">{heading}</h1>

            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              {description}
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
          totalMatching={total}
          shownCount={products.length}
          basePath={basePath}
        />

        <div className="mt-10">
          <ShopProductGrid products={products} hasFilters={hasFilters} />
        </div>

        <ShopPagination
          params={params}
          pageCount={pageCount}
          basePath={basePath}
        />
      </section>
    </main>
  );
}
