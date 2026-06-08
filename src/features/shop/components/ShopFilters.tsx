import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { createShopHref } from "../lib/shop-filters";
import type {
  ResolvedShopSearchParams,
  ShopCategoryFilter,
} from "../types/shop.types";

type ShopFiltersProps = {
  categories: ShopCategoryFilter[];
  params: ResolvedShopSearchParams;
  totalProducts: number;
  visibleProducts: number;
};

export default function ShopFilters({
  categories,
  params,
  totalProducts,
  visibleProducts,
}: ShopFiltersProps) {
  return (
    <div className="space-y-5 rounded-[1.5rem] border border-border bg-card p-4 md:p-5">
      <form action="/shop" className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          type="search"
          defaultValue={params.q}
          placeholder="Search products, brands, categories..."
          className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
        />

        {params.category ? (
          <input type="hidden" name="category" value={params.category} />
        ) : null}

        {params.sort !== "featured" ? (
          <input type="hidden" name="sort" value={params.sort} />
        ) : null}

        <Button type="submit" className="rounded-full">
          <Search className="size-4" />
          Search
        </Button>
      </form>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={createShopHref(params, { category: "" })}
            className={
              params.category === ""
                ? "shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground no-underline"
                : "shrink-0 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground no-underline hover:border-foreground"
            }
          >
            All
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={createShopHref(params, { category: category.slug })}
              className={
                params.category === category.slug
                  ? "shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground no-underline"
                  : "shrink-0 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground no-underline hover:border-foreground"
              }
            >
              {category.name}
              {category.productCount > 0 ? (
                <span className="ml-1 text-xs opacity-70">
                  {category.productCount}
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        <form action="/shop" className="flex items-center gap-2">
          {params.q ? <input type="hidden" name="q" value={params.q} /> : null}

          {params.category ? (
            <input type="hidden" name="category" value={params.category} />
          ) : null}

          <label htmlFor="shop-sort" className="text-sm text-muted-foreground">
            Sort
          </label>

          <select
            id="shop-sort"
            name="sort"
            defaultValue={params.sort}
            className="h-10 rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>

          <Button type="submit" variant="outline" className="rounded-full">
            Apply
          </Button>
        </form>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {visibleProducts} of {totalProducts} products
      </p>
    </div>
  );
}
