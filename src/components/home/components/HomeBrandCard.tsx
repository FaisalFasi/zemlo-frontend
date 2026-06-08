import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { HomeBrand } from "../data/home-page-data";

type HomeBrandCardProps = {
  brand: HomeBrand;
};

export default function HomeBrandCard({ brand }: HomeBrandCardProps) {
  return (
    <Link
      href={brand.href}
      className="group rounded-[1.5rem] border border-border bg-card p-5 no-underline transition-zemlo hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {brand.logoLabel}
        </div>

        <ArrowUpRight className="size-4 text-muted-foreground transition-zemlo group-hover:text-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
        {brand.name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {brand.description}
      </p>
    </Link>
  );
}
