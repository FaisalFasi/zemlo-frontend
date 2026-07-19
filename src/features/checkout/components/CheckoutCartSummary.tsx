import Link from "next/link";

import { Button } from "@/shared/ui/button";
import type { Cart } from "@/features/cart/types/cart.types";
import { formatDefaultMoney } from "@/shared/lib/formatters";

type CheckoutCartSummaryProps = {
  cart: Cart | undefined;
  isLoading: boolean;
};

function formatPrice(price: number) {
  return formatDefaultMoney(price);
}

export default function CheckoutCartSummary({
  cart,
  isLoading,
}: CheckoutCartSummaryProps) {
  if (isLoading) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading cart summary...</p>
      </aside>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-eyebrow text-muted-foreground">Order summary</p>

        <h2 className="mt-3 text-xl font-medium tracking-tight">
          Your cart is empty.
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Add products to your cart before creating checkout.
        </p>

        <Button asChild className="mt-5 rounded-full">
          <Link href="/shop">Go to shop</Link>
        </Button>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 lg:sticky lg:top-[calc(var(--navbar-height)+2rem)]">
      <p className="text-eyebrow text-muted-foreground">Order summary</p>

      <div className="mt-5 space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.product.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Qty {item.quantity}
                {item.variant ? ` · ${item.variant.name}` : null}
              </p>
            </div>

            <p className="shrink-0 text-sm font-medium text-foreground">
              {formatPrice(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-border pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium text-foreground">
            {cart.totalQuantity}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">
            {formatPrice(cart.subtotal)}
          </span>
        </div>

        <div className="flex justify-between border-t border-border pt-4">
          <span className="font-medium text-foreground">Estimated total</span>
          <span className="font-semibold text-foreground">
            {formatPrice(cart.subtotal)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Tax, shipping, and discounts are calculated by backend checkout rules.
      </p>
    </aside>
  );
}
