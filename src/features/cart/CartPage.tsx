"use client";

import { useState } from "react";

import { useCart } from "./hooks/use-cart";
import CartEmptyState from "./components/CartEmptyState";
import CartLineItem from "./components/CartLineItem";
import CartSummary from "./components/CartSummary";

export default function CartPage() {
  const {
    cart,
    cartItems,
    subtotal,
    totalQuantity,
    isCartLoading,
    cartError,
    updateItemQuantityAsync,
    removeItemAsync,
    clearCurrentCartAsync,
    isClearingCart,
  } = useCart();

  const [pendingItemId, setPendingItemId] = useState("");
  const [actionError, setActionError] = useState("");

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    try {
      setActionError("");
      setPendingItemId(itemId);

      await updateItemQuantityAsync({
        itemId,
        input: { quantity },
      });
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update cart item.",
      );
    } finally {
      setPendingItemId("");
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      setActionError("");
      setPendingItemId(itemId);

      await removeItemAsync(itemId);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not remove cart item.",
      );
    } finally {
      setPendingItemId("");
    }
  }

  async function handleClearCart() {
    try {
      setActionError("");

      await clearCurrentCartAsync();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not clear cart.",
      );
    }
  }

  if (isCartLoading) {
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

  if (!cart || cartItems.length === 0) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10 md:py-14">
          <CartEmptyState />

          {cartError || actionError ? (
            <div className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {cartError || actionError}
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
            Your cart is connected to the backend guest cart API and stays
            synced across product pages and navigation.
          </p>
        </div>

        {cartError || actionError ? (
          <div className="mb-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {cartError || actionError}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                isPending={pendingItemId === item.id}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <CartSummary
            subtotal={subtotal}
            totalQuantity={totalQuantity}
            isPending={isClearingCart}
            onClearCart={handleClearCart}
          />
        </div>
      </section>
    </main>
  );
}
