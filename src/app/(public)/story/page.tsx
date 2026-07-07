import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { PublicPagePlaceholder } from "@/widgets/public-page-placeholder";

export const metadata: Metadata = createPageMetadata({
  title: "Our Story",
  description:
    "Learn about Zemlo and the idea behind our Germany-first marketplace.",
  path: routes.company.story,
});

export default function StoryPage() {
  return (
    <PublicPagePlaceholder
      eyebrow="Our Story"
      title="Building a modern marketplace for thoughtful shopping."
      description="Zemlo is being built as a Germany-first, EU-ready multi-category e-commerce experience."
    />
  );
}
