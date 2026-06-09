import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { LegalPageShell, LegalSection } from "@/widgets/legal";

export const metadata: Metadata = createPageMetadata({
  title: "Returns and Withdrawal",
  description: "Returns and withdrawal information for Zemlo orders.",
  path: routes.legal.returns,
});

export default function ReturnsPage() {
  return (
    <LegalPageShell
      title="Returns and Withdrawal"
      description="Placeholder returns and withdrawal information. Replace with a reviewed Germany/EU-ready policy before launch."
    >
      <LegalSection title="Withdrawal period">
        <p>
          For many online purchases in the EU, consumers generally have a
          cooling-off period. Add the final withdrawal policy, exclusions,
          timelines, and process before production launch.
        </p>
      </LegalSection>

      <LegalSection title="How to request a return">
        <p>
          Add the final return request process, return address, customer support
          contact, refund timing, and condition requirements before going live.
        </p>
      </LegalSection>

      <LegalSection title="Refunds">
        <p>
          Refund rules should match the order status, payment provider, shipping
          policy, and applicable consumer rules.
        </p>
      </LegalSection>

      <LegalSection title="Important note">
        <p>
          This page is placeholder content and not legal advice. Review the
          final policy before accepting real customer orders.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
