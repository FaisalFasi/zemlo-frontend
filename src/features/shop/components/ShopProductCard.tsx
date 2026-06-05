import Image from "next/image";
import Link from "next/link";

import type { ShopProduct } from "../types/shop.types";

type ShopProductCardProps = {
  product: ShopProduct;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const hasDiscount =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block min-w-0 no-underline"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-w-0">
        <p className="truncate text-sm text-muted-foreground">
          {product.brand}
        </p>

        <h3 className="mt-1 truncate font-medium text-foreground">
          {product.name}
        </h3>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {product.category}
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
