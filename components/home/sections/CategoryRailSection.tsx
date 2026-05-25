import HomeProductRail from "../components/HomeProductRail";
import { categoryRails } from "../data/home-page-data";

export default function CategoryRailsSection() {
  return (
    <>
      {categoryRails.map((rail, index) => (
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
