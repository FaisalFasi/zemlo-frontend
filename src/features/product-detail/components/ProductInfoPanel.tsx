"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";

import { useAddCartItemMutation } from "@/features/cart/hooks/use-cart";
import { formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import type {
  ProductDetail,
  ProductDetailVariant,
} from "../types/product-detail.types";

type ProductInfoPanelProps = {
  product: ProductDetail;
};

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
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const addCartItemMutation = useAddCartItemMutation();
  const isAddingItem = addCartItemMutation.isPending;

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId),
    [product.variants, selectedVariantId],
  );

  const price = getSelectedPrice(product, selectedVariant);
  const compareAtPrice = getSelectedCompareAtPrice(product, selectedVariant);
  const stock = selectedVariant?.stock ?? product.stock;
  const hasDiscount =
    compareAtPrice !== undefined &&
    compareAtPrice !== null &&
    compareAtPrice > price;
  const isOutOfStock = stock <= 0;
  const requiresVariant = product.hasVariants && !selectedVariantId;
  const canAddToCart =
    !product.isDemo && !isOutOfStock && !requiresVariant && !isAddingItem;

  async function handleAddToCart() {
    setCartMessage("");
    setCartError("");

    if (product.isDemo) {
      setCartError("Demo products cannot be added to cart.");
      return;
    }

    if (requiresVariant) {
      setCartError("Please select a variant first.");
      return;
    }

    try {
      await addCartItemMutation.mutateAsync({
        productId: product.id,
        quantity,
        ...(selectedVariantId ? { variantId: selectedVariantId } : {}),
      });

      setCartMessage("Added to cart successfully.");
    } catch (error) {
      setCartError(
        error instanceof Error ? error.message : "Could not add item to cart.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          <span>{product.category.name}</span>

          {product.badge ? (
            <span className="rounded-full bg-foreground px-3 py-1 text-background">
              {product.badge}
            </span>
          ) : null}

          {product.isDemo ? (
            <span className="rounded-full border border-border px-3 py-1">
              Demo mode
            </span>
          ) : null}
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
          {product.name}
        </h1>

        {product.brand ? (
          <p className="text-sm text-muted-foreground">
            by{" "}
            <span className="font-medium text-foreground">
              {product.brand.name}
            </span>
          </p>
        ) : null}

        {product.shortDescription ? (
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
            {formatDefaultMoney(price)}
          </span>

          {hasDiscount ? (
            <span className="pb-1 text-sm text-muted-foreground line-through">
              {formatDefaultMoney(compareAtPrice)}
            </span>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">
          {isOutOfStock ? "Out of stock" : `${stock} available`}
        </p>
      </div>

      {product.variants.length > 0 ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Variant</span>
          <select
            value={selectedVariantId}
            onChange={(event) => {
              setSelectedVariantId(event.target.value);
              setQuantity(1);
              setCartMessage("");
              setCartError("");
            }}
            className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-foreground"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} · {formatDefaultMoney(variant.price)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Quantity</span>

        <div className="flex w-fit items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>

          <span className="min-w-10 text-center text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((current) => Math.min(stock || 1, current + 1))
            }
            className="flex size-11 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-50"
            aria-label="Increase quantity"
            disabled={isOutOfStock}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          className="h-12 w-full rounded-full text-sm font-semibold"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          {product.isDemo
            ? "Demo product"
            : isAddingItem
              ? "Adding..."
              : "Add to cart"}
        </Button>

        {cartMessage ? (
          <p className="text-sm text-emerald-700">
            {cartMessage}{" "}
            <Link href="/cart" className="font-medium underline">
              View cart
            </Link>
          </p>
        ) : null}

        {cartError ? <p className="text-sm text-red-600">{cartError}</p> : null}

        {product.isDemo ? (
          <p className="text-sm text-muted-foreground">
            Demo products are for UI preview only. Add real products from
            backend later to enable cart actions.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Truck className="size-4 text-foreground" />
          <span>
            Delivery and shipping options will be calculated at checkout.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-foreground" />
          <span>Secure checkout powered by Stripe.</span>
        </div>
      </div>
    </section>
  );
}
