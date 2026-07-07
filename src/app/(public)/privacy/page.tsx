import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { LegalPageShell, LegalSection } from "@/widgets/legal";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Privacy information for Zemlo customers and visitors.",
  path: routes.legal.privacy,
});

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This placeholder explains the privacy policy structure. Replace it with a reviewed GDPR-ready privacy policy before launch."
    >
      <LegalSection title="Who we are">
        <p>
          Zemlo is responsible for the processing of personal data on this
          website. Add the final controller details before production launch.
        </p>
      </LegalSection>

      <LegalSection title="Data we may process">
        <p>
          Depending on how the store is used, Zemlo may process account details,
          contact information, shipping and billing addresses, order data,
          payment-related references, customer support messages, analytics data,
          and technical log data.
        </p>
      </LegalSection>

      <LegalSection title="Why we process data">
        <p>
          Data may be processed to operate the store, fulfil orders, provide
          customer support, prevent fraud, meet legal obligations, improve the
          product experience, and maintain security.
        </p>
      </LegalSection>

      <LegalSection title="Payments">
        <p>
          Payments are processed through payment service providers such as
          Stripe. Do not place secret keys or full payment card data in frontend
          code or application logs.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Before launch, add the final process for access, correction, deletion,
          restriction, portability, objection, and complaint rights under
          applicable privacy laws.
        </p>
      </LegalSection>

      <LegalSection title="Important note">
        <p>
          This page is placeholder content and not legal advice. Replace it with
          a reviewed privacy policy before collecting real customer data.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
