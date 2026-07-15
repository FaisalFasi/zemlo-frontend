/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 *
 * YE KYA HAI: Customer ke "My Orders" page ka darwaza. Next.js ka rule:
 * src/app ke andar jis folder mein page.tsx rakho, wo website ka URL ban
 * jata hai — ye file /account/orders ka page banati hai (jaise Amazon ka
 * order history).
 *
 * REASON: Orders dikhane ke saare purzey ban chuke hain (OrdersList,
 * status badges, data-fetching) lekin unka koi URL nahi tha. Na banayen
 * to customer /account/orders khole to 404 milega.
 *
 * FILE KE 3 KAAM:
 *  1. Metadata — tab ka title + noIndex (Google is personal page ko
 *     index na kare)
 *  2. Heading — "Your orders"
 *  3. <OrdersList /> — pehle se bana component jo asal list dikhata hai
 *
 * RISK: Zero — koi purani file nahi badli, sirf naya page. Login ke
 * baghair middleware isay khulne hi nahi deta.
 * ═════════════════════════════════════════════════════════════════
 *
 * Route: /account/orders — customer order history (thin wrapper; real UI
 * lives in features/orders/OrdersList).
 */
import OrdersList from "@/features/orders/components/OrdersList";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Your orders",
  description: "Your Zemlo order history.",
  path: "/account/orders",
  noIndex: true,
});

export default function AccountOrdersPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container-page mx-auto max-w-2xl py-10 md:py-14">
        <p className="text-eyebrow text-muted-foreground">Account</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          Your orders
        </h1>

        <div className="mt-6">
          <OrdersList />
        </div>
      </section>
    </main>
  );
}
