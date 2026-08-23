import Link from "next/link";

import { cn } from "@/lib/utils";

import { createShopHref } from "../lib/shop-filters";
import type { ResolvedShopSearchParams } from "../types/shop.types";

type ShopPaginationProps = {
  params: ResolvedShopSearchParams;
  pageCount: number;
  basePath?: string;
};

const linkClassName =
  "rounded-full border border-border px-4 py-2 text-sm font-medium no-underline";

export default function ShopPagination({
  params,
  pageCount,
  basePath = "/shop",
}: ShopPaginationProps) {
  if (pageCount <= 1) return null;

  const hasPrev = params.page > 1;
  const hasNext = params.page < pageCount;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-3"
    >
      <Link
        href={createShopHref(
          params,
          { page: Math.max(1, params.page - 1) },
          basePath,
        )}
        aria-disabled={!hasPrev}
        tabIndex={hasPrev ? undefined : -1}
        className={cn(
          linkClassName,
          hasPrev
            ? "text-foreground hover:border-foreground"
            : "pointer-events-none text-muted-foreground opacity-50",
        )}
      >
        Previous
      </Link>

      <span className="text-sm text-muted-foreground">
        Page {params.page} of {pageCount}
      </span>

      <Link
        href={createShopHref(
          params,
          { page: Math.min(pageCount, params.page + 1) },
          basePath,
        )}
        aria-disabled={!hasNext}
        tabIndex={hasNext ? undefined : -1}
        className={cn(
          linkClassName,
          hasNext
            ? "text-foreground hover:border-foreground"
            : "pointer-events-none text-muted-foreground opacity-50",
        )}
      >
        Next
      </Link>
    </nav>
  );
}
