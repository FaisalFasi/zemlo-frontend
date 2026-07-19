/**
 * Customer order history list for /account/orders.
 *
 * Handles all four data states (loading skeleton / error + retry /
 * empty + CTA / list) — a production screen never shows a blank page
 * or a raw error. Each row links to the order detail page.
 */
"use client";

import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";

import { routes } from "@/shared/config";
import { formatDefaultDate, formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import { useMyOrdersQuery } from "../hooks/use-orders";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrdersList() {
  const ordersQuery = useMyOrdersQuery();

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-3xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          We could not load your orders. Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => ordersQuery.refetch()}
          className="mt-4 rounded-full"
        >
          Try again
        </Button>
      </div>
    );
  }

  const orders = ordersQuery.data ?? [];

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <PackageSearch className="mx-auto size-8 text-muted-foreground" />

        <h2 className="mt-4 text-lg font-medium text-foreground">
          No orders yet
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          When you place your first order, it will show up here.
        </p>

        <Button asChild className="mt-5 rounded-full">
          <Link href={routes.shop}>Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`${routes.account}/orders/${encodeURIComponent(order.orderNumber)}`}
            className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 no-underline transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                {order.orderNumber}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {formatDefaultDate(order.createdAt)} ·{" "}
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <OrderStatusBadge kind="order" status={order.status} />
                <OrderStatusBadge kind="payment" status={order.paymentStatus} />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-medium text-foreground">
                {formatDefaultMoney(order.total)}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
