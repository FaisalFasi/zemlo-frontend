import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { LegalPageShell, LegalSection } from "@/widgets/legal";

export const metadata: Metadata = createPageMetadata({
  title: "Impressum",
  description: "Provider information and legal notice for Zemlo.",
  path: routes.legal.impressum,
});

export default function ImpressumPage() {
  return (
    <LegalPageShell
      title="Impressum"
      description="Provider information and legal notice for Zemlo. Replace the placeholder fields below before production launch."
    >
      <LegalSection title="Provider information">
        <p>
          This page is a placeholder for the required provider information. Add
          the legal business name, address, authorised representative, contact
          details, register information, VAT ID where applicable, and
          responsible content owner before going live.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>Email: legal@zemlo.example</p>
        <p>Phone: To be added before launch.</p>
      </LegalSection>

      <LegalSection title="Business registration">
        <p>Commercial register: To be added where applicable.</p>
        <p>VAT ID: To be added where applicable.</p>
      </LegalSection>

      <LegalSection title="Important note">
        <p>
          This placeholder is not legal advice. For a Germany-first launch,
          review the final Impressum with a qualified legal professional.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
