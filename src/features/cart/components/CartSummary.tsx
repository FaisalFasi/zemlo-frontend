import Link from "next/link";

import { Button } from "@/components/ui/button";

type CartSummaryProps = {
  subtotal: number;
  totalQuantity: number;
  isPending: boolean;
  onClearCart: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CartSummary({
  subtotal,
  totalQuantity,
  isPending,
  onClearCart,
}: CartSummaryProps) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-6 lg:sticky lg:top-[calc(var(--navbar-height)+2rem)]">
      <p className="text-eyebrow text-muted-foreground">Order summary</p>

      <div className="mt-5 space-y-4">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium text-foreground">{totalQuantity}</span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between gap-4 border-t border-border pt-4 text-base">
          <span className="font-medium text-foreground">Estimated total</span>
          <span className="font-semibold text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <Button asChild className="mt-6 w-full rounded-full">
        <Link href="/checkout">Checkout</Link>
      </Button>

      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        Checkout page and Stripe Elements will be connected in the next step.
      </p>

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={onClearCart}
        className="mt-4 w-full rounded-full"
      >
        Clear cart
      </Button>

      <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </aside>
  );
}
