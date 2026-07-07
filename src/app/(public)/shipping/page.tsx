import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { LegalPageShell, LegalSection } from "@/widgets/legal";

export const metadata: Metadata = createPageMetadata({
  title: "Shipping Information",
  description: "Shipping information for Zemlo customers.",
  path: routes.legal.shipping,
});

export default function ShippingPage() {
  return (
    <LegalPageShell
      title="Shipping Information"
      description="Placeholder shipping information for Germany/EU-first launch planning."
    >
      <LegalSection title="Shipping countries">
        <p>
          Zemlo is planned as Germany-first, EU-ready, and Pakistan-ready later.
          Add enabled shipping countries, delivery methods, carrier rules, and
          market-specific restrictions before launch.
        </p>
      </LegalSection>

      <LegalSection title="Shipping costs">
        <p>
          Add how shipping costs are calculated, including country, weight,
          order value, carrier, and tax handling.
        </p>
      </LegalSection>

      <LegalSection title="Delivery times">
        <p>
          Add estimated delivery timelines for Germany, EU markets, and future
          international destinations.
        </p>
      </LegalSection>

      <LegalSection title="Important note">
        <p>
          This page is placeholder content. Final shipping rules should match
          backend checkout pricing, inventory origin, tax, and carrier logic.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
