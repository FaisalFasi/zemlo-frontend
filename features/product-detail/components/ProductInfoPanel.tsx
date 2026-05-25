"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  ProductDetail,
  ProductDetailVariant,
} from "../types/product-detail.types";

type ProductInfoPanelProps = {
  product: ProductDetail;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getSelectedPrice(
  product: ProductDetail,
  selectedVariant?: ProductDetailVariant,
) {
  return selectedVariant?.price ?? product.price;
}

function getSelectedCompareAtPrice(
  product: ProductDetail,
  selectedVariant?: ProductDetailVariant,
) {
  return selectedVariant?.compareAtPrice ?? product.compareAtPrice;
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId),
    [product.variants, selectedVariantId],
  );

  const price = getSelectedPrice(product, selectedVariant);
  const compareAtPrice = getSelectedCompareAtPrice(product, selectedVariant);
  const stock = selectedVariant?.stock ?? product.stock;
  const hasDiscount = compareAtPrice !== undefined && compareAtPrice > price;

  const isOutOfStock = stock <= 0;

  return (
    <div className="lg:sticky lg:top-[calc(var(--navbar-height)+2rem)]">
      <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {product.category.name}
          </span>

          {product.badge ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {product.badge}
            </span>
          ) : null}

          {product.isDemo ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Demo mode
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-section-title text-balance">{product.name}</h1>

        {product.brand ? (
          <p className="mt-3 text-sm text-muted-foreground">
            by{" "}
            <span className="font-medium text-foreground">
              {product.brand.name}
            </span>
          </p>
        ) : null}

        {product.shortDescription ? (
          <p className="mt-5 leading-7 text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-6 flex items-end gap-3">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {formatPrice(price)}
          </span>

          {hasDiscount ? (
            <span className="pb-1 text-lg text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </span>
          ) : null}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {isOutOfStock ? "Out of stock" : `${stock} available`}
        </p>

        {product.variants.length > 0 ? (
          <div className="mt-7">
            <label
              htmlFor="product-variant"
              className="text-sm font-medium text-foreground"
            >
              Variant
            </label>

            <select
              id="product-variant"
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-foreground"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} · {formatPrice(variant.price)}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="mt-7">
          <p className="text-sm font-medium text-foreground">Quantity</p>

          <div className="mt-2 inline-flex items-center rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>

            <span className="w-10 text-center text-sm font-medium">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(stock || 1, current + 1))
              }
              className="flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
              aria-label="Increase quantity"
              disabled={isOutOfStock}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          disabled
          className="mt-7 w-full rounded-full"
        >
          Add to cart
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Cart integration is the next step. The product page is ready for the
          cart API payload.
        </p>

        <div className="mt-7 grid gap-3 border-t border-border pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="size-4 text-foreground" />
            Delivery and shipping options will be calculated at checkout.
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-foreground" />
            Secure checkout will use your existing Stripe PaymentIntent flow.
          </div>
        </div>
      </div>
    </div>
  );
}
