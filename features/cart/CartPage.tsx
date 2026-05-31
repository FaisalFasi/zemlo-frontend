"use client";

import { useEffect, useState } from "react";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./api/cart-api";
import CartEmptyState from "./components/CartEmptyState";
import CartLineItem from "./components/CartLineItem";
import CartSummary from "./components/CartSummary";
import type { Cart } from "./types/cart.types";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState("");
  const [error, setError] = useState("");

  async function loadCart() {
    try {
      setError("");
      const nextCart = await getCart();
      setCart(nextCart);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load cart.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    try {
      setPendingAction(itemId);
      setError("");

      const nextCart = await updateCartItem(itemId, { quantity });

      setCart(nextCart);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update cart item.",
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      setPendingAction(itemId);
      setError("");

      const nextCart = await removeCartItem(itemId);

      setCart(nextCart);
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Could not remove cart item.",
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleClearCart() {
    try {
      setPendingAction("clear-cart");
      setError("");

      const nextCart = await clearCart();

      setCart(nextCart);
    } catch (clearError) {
      setError(
        clearError instanceof Error
          ? clearError.message
          : "Could not clear cart.",
      );
    } finally {
      setPendingAction("");
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  if (isLoading) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10 md:py-14">
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
            Loading cart...
          </div>
        </section>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10 md:py-14">
          <CartEmptyState />

          {error ? (
            <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <section className="container-page py-10 md:py-14">
        <div className="mb-8">
          <p className="text-eyebrow text-muted-foreground">Shopping cart</p>

          <h1 className="mt-3 text-section-title">
            Review your selected items.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            This cart is connected to your backend guest cart API using
            x-guest-id.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                isPending={pendingAction === item.id}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <CartSummary
            subtotal={cart.subtotal}
            totalQuantity={cart.totalQuantity}
            isPending={pendingAction === "clear-cart"}
            onClearCart={handleClearCart}
          />
        </div>
      </section>
    </main>
  );
}
