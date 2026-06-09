import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { LegalPageShell, LegalSection } from "@/widgets/legal";

export const metadata: Metadata = createPageMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for using Zemlo.",
  path: routes.legal.terms,
});

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      description="Placeholder terms for the Zemlo storefront. Replace with reviewed terms before launch."
    >
      <LegalSection title="Scope">
        <p>
          These placeholder terms describe the intended structure for customer
          terms. Add the final contract language, seller details, customer
          obligations, pricing, order acceptance, payment, delivery, liability,
          and dispute information before launch.
        </p>
      </LegalSection>

      <LegalSection title="Orders">
        <p>
          Product listings, prices, availability, taxes, shipping fees, and
          order confirmation rules must be finalized before taking live orders.
        </p>
      </LegalSection>

      <LegalSection title="Payments">
        <p>
          Payment methods and payment capture rules should match the backend
          checkout and Stripe PaymentIntent flow.
        </p>
      </LegalSection>

      <LegalSection title="Important note">
        <p>
          This page is placeholder content and not legal advice. Do not use it
          as final production terms.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
