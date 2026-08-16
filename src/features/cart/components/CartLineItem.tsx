import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { productFallbackImages } from "@/entities/product/model/product-utils";
import { formatDefaultMoney } from "@/shared/lib/formatters";
import { getSafeImageUrl } from "@/shared/lib/safe-image-url";
import type { CartItem } from "../types/cart.types";

type CartLineItemProps = {
  item: CartItem;
  isPending: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

function formatPrice(price: number) {
  return formatDefaultMoney(price);
}

// EXPLANATION: cart ka "best image" chunna product-listing wale chain se
// alag hai (pehle selected VARIANT ki image, phir product ki default) —
// isliye ye apna chhota function hai, lekin fallback constant aur safety-
// check (getSafeImageUrl) wahi shared cheezein hain jo baqi app use karta
// hai — ek jagah, sab jagah consistent.
function getCartItemImage(item: CartItem) {
  return getSafeImageUrl(
    item.variant?.image ?? item.product.images[0]?.url,
    productFallbackImages.card,
  );
}

export default function CartLineItem({
  item,
  isPending,
  onUpdateQuantity,
  onRemove,
}: CartLineItemProps) {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-border bg-card p-4 sm:grid-cols-[7rem_1fr]">
      <Link
        href={`/products/${item.product.slug}`}
        className="relative aspect-square overflow-hidden rounded-2xl bg-muted no-underline sm:aspect-auto"
      >
        <Image
          src={getCartItemImage(item)}
          alt={item.product.name}
          fill
          sizes="7rem"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {item.product.brand?.name ?? "Zemlo"}
            </p>

            <Link
              href={`/products/${item.product.slug}`}
              className="mt-1 block truncate font-medium text-foreground no-underline"
            >
              {item.product.name}
            </Link>

            {item.variant ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.variant.name}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={isPending}
            className="rounded-full p-2 text-muted-foreground transition-zemlo hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              disabled={isPending || item.quantity <= 1}
              className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>

            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isPending}
              className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.unitPrice)} each
            </p>

            <p className="font-semibold text-foreground">
              {formatPrice(item.lineTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
