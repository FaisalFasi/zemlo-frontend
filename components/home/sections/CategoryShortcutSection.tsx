import HomeCategoryCard from "../components/HomeCategoryCard";
import HomeSectionHeader from "../components/HomeSectionHeader";
import { homeCategories } from "../data/home-page-data";

export default function CategoryShortcutSection() {
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
          {homeCategories.map((category) => (
            <HomeCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
