/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Dashboard ke stat cards — orders today, revenue today,
 * low-stock count. Ab real backend endpoint (`GET /admin/stats`) se aate
 * hain.
 * REASON: Pehle ye poori orders list fetch kar ke client-side count karte
 * thay (frontend integration notes ke mutabiq scale nahi karta) — ab
 * backend khud count karta hai, ek chhoti si request. `analytics.view`
 * permission chahiye (sirf ADMIN/SUPER_ADMIN) — jin ke paas nahi, unke
 * liye request hi nahi bhejtay.
 * RISK: Zero — read-only.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import AdminEntityLoadError from "@/features/admin/components/AdminEntityLoadError";
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";
import { formatDefaultMoney } from "@/shared/lib/formatters";

import { useAdminStatsQuery } from "../hooks/use-admin-orders";

export default function AdminDashboardStats() {
  const canViewAnalytics = useAdminPermission("analytics.view");
  const statsQuery = useAdminStatsQuery(canViewAnalytics);

  if (!canViewAnalytics) {
    return (
      <p className="text-sm text-muted-foreground">
        Your role does not have permission to view store analytics.
      </p>
    );
  }

  if (statsQuery.isLoading) {
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

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <AdminEntityLoadError
        message="Order stats are unavailable right now."
        onRetry={() => statsQuery.refetch()}
      />
    );
  }

  const stats = statsQuery.data;

  const cards = [
    { label: "Orders today", value: String(stats.ordersToday) },
    {
      label: "Revenue today",
      value: formatDefaultMoney(stats.revenueToday),
    },
    {
      label: "Low stock",
      value: String(stats.lowStockCount),
      hint: `at or below ${stats.lowStockThreshold} units`,
    },
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
          {card.hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
