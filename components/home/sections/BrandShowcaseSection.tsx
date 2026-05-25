import HomeBrandCard from "../components/HomeBrandCard";
import HomeSectionHeader from "../components/HomeSectionHeader";
import { featuredBrands } from "../data/home-page-data";

export default function BrandShowcaseSection() {
  return (
    <section className="section-md bg-surface-muted">
      <div className="container-page">
        <HomeSectionHeader
          eyebrow="Featured brands"
          title="Shop Zemlo and trusted brands."
          description="This keeps the homepage open for your own products plus third-party brands without making the store feel limited."
          action={{
            label: "View all brands",
            href: "/brands",
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBrands.map((brand) => (
            <HomeBrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
