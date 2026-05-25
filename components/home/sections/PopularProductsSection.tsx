import HomeProductRail from "../components/HomeProductRail";
import { popularProducts } from "../data/home-page-data";

export default function PopularProductsSection() {
  return (
    <HomeProductRail
      eyebrow="Customer favorites"
      title="Popular across the marketplace."
      description="A flexible section for best sellers, trending products, recently viewed items, or personalized recommendations."
      products={popularProducts}
      action={{
        label: "Explore products",
        href: "/shop",
      }}
    />
  );
}
