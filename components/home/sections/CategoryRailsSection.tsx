import HomeProductRail from "../components/HomeProductRail";

import type { HomeCategoryRail } from "../data/home-page-data";

type CategoryRailsSectionProps = {
  rails: HomeCategoryRail[];
};

export default function CategoryRailsSection({
  rails,
}: CategoryRailsSectionProps) {
  return (
    <>
      {rails.map((rail, index) => (
        <HomeProductRail
          key={rail.id}
          eyebrow={rail.eyebrow}
          title={rail.title}
          description={rail.description}
          products={rail.products}
          surface={index % 2 === 0 ? "default" : "muted"}
          action={{
            label: "View more",
            href: rail.href,
          }}
        />
      ))}
    </>
  );
}
