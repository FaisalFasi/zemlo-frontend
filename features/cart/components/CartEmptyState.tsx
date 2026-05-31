import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CartEmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShoppingBag className="size-6" />
      </div>

      <h1 className="mt-5 text-2xl font-medium tracking-tight text-foreground">
        Your cart is empty.
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Add products from the shop. Guest cart support is connected through your
        backend cart API.
      </p>

      <Button asChild className="mt-6 rounded-full">
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
