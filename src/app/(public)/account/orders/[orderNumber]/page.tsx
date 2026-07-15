/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 *
 * YE KYA HAI: Ek single order ki poori detail ka page. Folder ke naam
 * mein [orderNumber] (square brackets) Next.js ka "dynamic route" hai —
 * matlab /account/orders/ZM-1001 kholo to "ZM-1001" is page ko parameter
 * ke tor par milta hai, har order number ke liye alag file nahi banani
 * parti.
 *
 * REASON: Pichhli file (order list) mein har order ek link hai jo yahan
 * aata hai. Ye page na ho to list ke links 404 par le jayenge. Customer
 * ko order ke items, totals (subtotal/shipping/tax), address aur
 * tracking yahin dikhte hain.
 *
 * FILE KE 2 KAAM:
 *  1. URL se orderNumber nikaalna (Next.js 15 mein params ek Promise
 *     hota hai, is liye await karna parta hai)
 *  2. <OrderDetailPanel /> ko wo number dena — asal UI wahan hai
 *     (features/orders mein, architecture rule ke mutabiq)
 *
 * RISK: Zero — nayi file hai, kuch purana nahi badla. Middleware login
 * ke baghair isay khulne nahi deta, aur backend bhi sirf USI user ka
 * order deta hai jis ka wo hai (doosre ka order number daalo to 404).
 * ═════════════════════════════════════════════════════════════════
 *
 * Route: /account/orders/[orderNumber] — single order detail (thin
 * wrapper; real UI lives in features/orders/OrderDetailPanel).
 */
import OrderDetailPanel from "@/features/orders/components/OrderDetailPanel";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Order details",
  description: "Your Zemlo order details.",
  path: "/account/orders",
  noIndex: true,
});

type AccountOrderDetailPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { orderNumber } = await params;

  return (
    <main className="bg-background text-foreground">
      <section className="container-page mx-auto max-w-2xl py-10 md:py-14">
        <OrderDetailPanel orderNumber={decodeURIComponent(orderNumber)} />
      </section>
    </main>
  );
}
