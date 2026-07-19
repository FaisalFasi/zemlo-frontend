/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Admin panel ki orders table — har row: order number, date,
 * customer, status/payment badges, total, aur "View" link.
 * REASON: Store owner ka roz ka screen — kaunse orders aaye, kis ka
 * payment hua, kya shipped karna hai. Styling products table jaisi
 * (consistent admin UI), status badges customer-side OrderStatusBadge
 * se reuse (ek hi mapping har jagah). 4 states handle: loading skeleton,
 * error + retry, empty, data.
 * RISK: Zero — naya component.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import Link from "next/link";
import { ExternalLink, Inbox } from "lucide-react";

import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import { formatDefaultDate, formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import { useAdminOrdersQuery } from "../hooks/use-admin-orders";
import type { AdminOrderSummary } from "../types/admin-order.types";

function getCustomerLabel(order: AdminOrderSummary) {
  const guestName = [order.guestFirstName, order.guestLastName]
    .filter(Boolean)
    .join(" ");

  if (guestName) return guestName;
  if (order.guestEmail) return order.guestEmail;

  return order.userId ? "Registered user" : "Unknown";
}

export default function AdminOrdersTable() {
  const ordersQuery = useAdminOrdersQuery();

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load orders. Please try again.
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
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="size-6" />
        </div>

        <h2 className="mt-5 text-2xl font-medium tracking-tight text-foreground">
          No orders yet.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          When customers place orders, they will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Payment</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="align-middle">
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDefaultDate(order.createdAt)} ·{" "}
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {getCustomerLabel(order)}
                </td>

                <td className="px-5 py-4">
                  <OrderStatusBadge kind="order" status={order.status} />
                </td>

                <td className="px-5 py-4">
                  <OrderStatusBadge
                    kind="payment"
                    status={order.paymentStatus}
                  />
                </td>

                <td className="px-5 py-4 font-medium text-foreground">
                  {formatDefaultMoney(order.total)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <Link href={`/admin/orders/${order.id}`}>
                        <ExternalLink className="size-3.5" />
                        View
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
