import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { PublicPagePlaceholder } from "@/widgets/public-page-placeholder";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Zemlo for customer support, partnerships, and store questions.",
  path: routes.company.contact,
});

export default function ContactPage() {
  return (
    <PublicPagePlaceholder
      eyebrow="Contact"
      title="We are here to help."
      description="Customer support, business contact, and marketplace communication channels will be added before production launch."
    />
  );
}
