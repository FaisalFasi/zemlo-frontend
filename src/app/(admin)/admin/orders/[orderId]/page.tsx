/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /admin/orders/<id> ka page — [orderId] dynamic segment
 * se order ki id nikaal kar AdminOrderDetailPanel ko deta hai.
 * REASON: Orders table ka "View" button yahan laata hai; ye page na ho
 * to wo link 404 dega. Customer detail page jaisa hi thin-wrapper.
 * RISK: Zero — middleware + AdminShell protect karte hain; backend
 * bhi ORDERS_VIEW_ALL permission ke baghair data nahi deta.
 * ═════════════════════════════════════════════════════════════════
 */
import AdminShell from "@/features/admin/components/AdminShell";
import AdminOrderDetailPanel from "@/features/admin/orders/components/AdminOrderDetailPanel";

export const metadata = {
  title: "Order details — Zemlo Admin",
};

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

function safeDecodeUriComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    // A malformed % sequence in a hand-edited/bookmarked URL throws a
    // URIError — fall back to the raw segment rather than crashing the
    // page for what should just resolve to "order not found".
    return value;
  }
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <AdminShell>
      <AdminOrderDetailPanel orderId={safeDecodeUriComponent(orderId)} />
    </AdminShell>
  );
}
