/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Ek order ka poora admin screen — header + badges,
 * customer info, items + totals, shipping address, status/shipping
 * update forms (alag component), aur status history (audit trail:
 * kis ne kab kya badla).
 * REASON: Fulfilment ek screen se hona chahiye. Customer wale panel se
 * alag is liye hai ke yahan admin cheezein BADAL sakta hai aur guest
 * ka contact + history bhi dekhta hai jo customer ko nahi dikhta.
 * RISK: Zero — naya component; changes sirf forms ke Save se hote hain.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import { formatDefaultDate, formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import { useAdminOrderQuery } from "../hooks/use-admin-orders";
import type { AdminOrderDetail } from "../types/admin-order.types";
import AdminOrderUpdateForms from "./AdminOrderUpdateForms";

function getCustomerBlock(order: AdminOrderDetail) {
  if (order.user) {
    return {
      name: [order.user.firstName, order.user.lastName]
        .filter(Boolean)
        .join(" "),
      email: order.user.email,
      phone: order.user.phone ?? "—",
      kind: "Registered customer",
    };
  }

  return {
    name:
      [order.guestFirstName, order.guestLastName].filter(Boolean).join(" ") ||
      "—",
    email: order.guestEmail ?? "—",
    phone: order.guestPhone ?? "—",
    kind: "Guest checkout",
  };
}

type AdminOrderDetailPanelProps = {
  orderId: string;
};

export default function AdminOrderDetailPanel({
  orderId,
}: AdminOrderDetailPanelProps) {
  const orderQuery = useAdminOrderQuery(orderId);

  if (orderQuery.isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-28 animate-pulse rounded-[2rem] border border-border bg-muted" />
        <div className="h-64 animate-pulse rounded-[2rem] border border-border bg-muted" />
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load this order.
        </p>

        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const order = orderQuery.data;
  const customer = getCustomerBlock(order);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      {/* Header */}
      <div className="rounded-[2rem] border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-foreground">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatDefaultDate(order.createdAt)}
              {order.paidAt ? ` · paid ${formatDefaultDate(order.paidAt)}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge kind="order" status={order.status} />
            <OrderStatusBadge kind="payment" status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Customer + address */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Customer — {customer.kind}
          </h2>

          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="w-16 text-muted-foreground">Name</dt>
              <dd className="text-foreground">{customer.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 text-muted-foreground">Email</dt>
              <dd className="text-foreground">{customer.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{customer.phone}</dd>
            </div>
          </dl>

          {order.customerNote ? (
            <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
              Note: {order.customerNote}
            </p>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Shipping address
          </h2>

          {order.shippingAddress ? (
            <address className="mt-3 text-sm not-italic leading-6 text-foreground">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
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
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No address.</p>
          )}
        </div>
      </div>

      {/* Items + totals */}
      <div className="rounded-[2rem] border border-border bg-card p-6">
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
                  {item.sku ? `${item.sku} · ` : ""}
                  {item.quantity} × {formatDefaultMoney(item.unitPrice)}
                </p>
              </div>

              <span className="shrink-0 font-medium text-foreground">
                {formatDefaultMoney(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

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

      {/* Update forms */}
      <AdminOrderUpdateForms order={order} />

      {/* Status history — audit trail */}
      {order.statusHistory.length > 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Status history
          </h2>

          <ul className="mt-4 space-y-3">
            {order.statusHistory.map((entry) => (
              <li key={entry.id} className="text-sm">
                <span className="font-medium text-foreground">
                  {entry.status}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  · {formatDefaultDate(entry.createdAt)}
                  {entry.note ? ` · ${entry.note}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
