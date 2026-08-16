/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /products ka page — pehle yahan sirf <div>Products</div>
 * ka adhoora stub tha; ab ye seedha /shop par redirect karta hai.
 * REASON: Adhoora page customer ko toota hua lagta hai. Product listing
 * ka asal ghar /shop hai — do jagah ek hi cheez nahi honi chahiye.
 * RISK: Zero — stub ka koi consumer nahi tha; redirect() Next.js ka
 * standard server-side redirect hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { redirect } from "next/navigation";

import { routes } from "@/shared/config/routes";

export default function ProductsPage() {
  redirect(routes.shop);
}
