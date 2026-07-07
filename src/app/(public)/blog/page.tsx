import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { PublicPagePlaceholder } from "@/widgets/public-page-placeholder";

export const metadata: Metadata = createPageMetadata({
  title: "Journal",
  description: "Product stories, shopping guides, and Zemlo updates.",
  path: routes.company.blog,
});

export default function BlogPage() {
  return (
    <PublicPagePlaceholder
      eyebrow="Journal"
      title="Guides, updates, and product stories."
      description="The Zemlo journal will share shopping guides, product education, and marketplace updates."
    />
  );
}
