import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { formatMoney } from "@/shared/lib/formatters";
import type { HomeProduct } from "../data/home-page-data";

type HomeProductCardProps = {
  product: HomeProduct;
};

function formatPrice(price: number) {
  return formatMoney({ amount: price, maximumFractionDigits: 0 });
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
  const href = `/products/${product.slug}`;
  const hasDiscount =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;

  return (
    <Link href={href} className="group block min-w-0 no-underline">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 80vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm text-muted-foreground">
            {product.brand}
          </p>

          {product.rating ? (
            <div className="flex shrink-0 items-center gap-1 text-sm text-foreground">
              <Star className="size-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        <h3 className="mt-1 truncate font-medium text-foreground">
          {product.name}
        </h3>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {product.category}
          {product.reviewCount ? (
            <> · {product.reviewCount.toLocaleString()} reviews</>
          ) : null}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>

          {hasDiscount ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice ?? 0)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
