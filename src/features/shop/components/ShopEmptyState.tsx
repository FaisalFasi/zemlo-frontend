import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { Button } from "@/shared/ui/button";

type ShopEmptyStateProps = {
  hasFilters: boolean;
};

export default function ShopEmptyState({ hasFilters }: ShopEmptyStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageSearch className="size-6" />
      </div>

      <h2 className="mt-5 text-2xl font-medium tracking-tight text-foreground">
        {hasFilters ? "No products found." : "Products are being prepared."}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? "Try changing your search or category filter."
          : "Products will appear here once they are added from the admin dashboard."}
      </p>

      {hasFilters ? (
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link href="/shop">Clear filters</Link>
        </Button>
      ) : null}
    </div>
  );
}
