import HomeCategoryCard from "../components/HomeCategoryCard";
import HomeSectionHeader from "../components/HomeSectionHeader";

import type { HomeCategory } from "../data/home-page-data";

type CategoryShortcutSectionProps = {
  categories: HomeCategory[];
};

export default function CategoryShortcutSection({
  categories,
}: CategoryShortcutSectionProps) {
  return (
    <section className="section-md bg-background">
      <div className="container-page">
        <HomeSectionHeader
          eyebrow="Shop by category"
          title="Find what you need faster."
          description="Zemlo is structured for many categories, so customers immediately understand this is not a single-brand clothing store."
          action={{
            label: "View all categories",
            href: "/categories",
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <HomeCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
