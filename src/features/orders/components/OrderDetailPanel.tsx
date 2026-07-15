/**
 * Full order view for /account/orders/[orderNumber].
 *
 * Renders the immutable order snapshot: item names/prices are what the
 * customer actually paid (order data), never the live product — editing
 * a product later must not rewrite old receipts. Totals come straight
 * from the backend; the frontend never recalculates money.
 */
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/shared/config";
import { formatDefaultDate, formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import { useMyOrderQuery } from "../hooks/use-orders";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderDetailPanelProps = {
  orderNumber: string;
};

export default function OrderDetailPanel({
  orderNumber,
}: OrderDetailPanelProps) {
  const orderQuery = useMyOrderQuery(orderNumber);

  if (orderQuery.isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-32 animate-pulse rounded-3xl border border-border bg-muted" />
        <div className="h-64 animate-pulse rounded-3xl border border-border bg-muted" />
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          We could not find this order. It may belong to a different account.
        </p>

        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link href={`${routes.account}/orders`}>Back to orders</Link>
        </Button>
      </div>
    );
  }

  const order = orderQuery.data;

  return (
    <div className="space-y-4">
      <Link
        href={`${routes.account}/orders`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      {/* Header: order number, date, status */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-foreground">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {formatDefaultDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge kind="order" status={order.status} />
            <OrderStatusBadge kind="payment" status={order.paymentStatus} />
          </div>
        </div>

        {order.trackingNumber ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Tracking:{" "}
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4"
              >
                {order.trackingNumber}
              </a>
            ) : (
              <span className="font-medium text-foreground">
                {order.trackingNumber}
              </span>
            )}
            {order.shippingCarrier ? ` · ${order.shippingCarrier}` : null}
          </p>
        ) : null}
      </div>

      {/* Items — from the order snapshot, not live products */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Items
        </h2>

        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {item.productName}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.variantName ? `${item.variantName} · ` : ""}
                  {item.quantity} × {formatDefaultMoney(item.unitPrice)}
                </p>
              </div>

              <span className="shrink-0 font-medium text-foreground">
                {formatDefaultMoney(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals — displayed exactly as the backend calculated them */}
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">
              {formatDefaultMoney(order.subtotal)}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-foreground">
              {order.shippingCost === 0
                ? "Free"
                : formatDefaultMoney(order.shippingCost)}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="text-foreground">{formatDefaultMoney(order.tax)}</dd>
          </div>

          {order.discount > 0 ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="text-foreground">
                −{formatDefaultMoney(order.discount)}
              </dd>
            </div>
          ) : null}

          <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
            <dt className="text-foreground">Total</dt>
            <dd className="text-foreground">
              {formatDefaultMoney(order.total)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Shipping address */}
      {order.shippingAddress ? (
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Shipping address
          </h2>

          <address className="mt-3 text-sm not-italic leading-6 text-foreground">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.street}
            {order.shippingAddress.apartment
              ? `, ${order.shippingAddress.apartment}`
              : ""}
            <br />
            {order.shippingAddress.zipCode} {order.shippingAddress.city}
            <br />
            {order.shippingAddress.country}
          </address>
        </div>
      ) : null}
    </div>
  );
}
