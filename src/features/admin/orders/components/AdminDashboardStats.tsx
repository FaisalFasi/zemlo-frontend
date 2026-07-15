/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Dashboard ke 3 stat cards — total orders, "needs action"
 * (PENDING + CONFIRMED jo process karne hain), aur paid revenue (EUR).
 * REASON: Owner ko login karte hi ek nazar mein store ki halat dikhe.
 * Backend mein stats endpoint NAHI hai, is liye numbers orders list se
 * frontend par count ho rahe hain — chhote store ke liye theek; scale
 * par backend endpoint banega (ROADMAP note).
 * RISK: Zero — read-only; wohi orders-list query reuse hoti hai jo
 * table use karti hai (koi extra backend call nahi).
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { formatDefaultMoney } from "@/shared/lib/formatters";

import { useAdminOrdersQuery } from "../hooks/use-admin-orders";
import type { AdminOrderSummary } from "../types/admin-order.types";

function computeStats(orders: AdminOrderSummary[]) {
  const needsAction = orders.filter(
    (order) => order.status === "PENDING" || order.status === "CONFIRMED",
  ).length;

  const paidRevenue = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.total, 0);

  return {
    totalOrders: orders.length,
    needsAction,
    paidRevenue,
  };
}

export default function AdminDashboardStats() {
  const ordersQuery = useAdminOrdersQuery();

  if (ordersQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-[2rem] border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <p className="text-sm text-muted-foreground">
        Order stats are unavailable right now.
      </p>
    );
  }

  const stats = computeStats(ordersQuery.data ?? []);

  const cards = [
    { label: "Total orders", value: String(stats.totalOrders) },
    { label: "Needs action", value: String(stats.needsAction) },
    { label: "Revenue (paid)", value: formatDefaultMoney(stats.paidRevenue) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[2rem] border border-border bg-card p-6"
        >
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-3xl font-medium tracking-tight text-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
