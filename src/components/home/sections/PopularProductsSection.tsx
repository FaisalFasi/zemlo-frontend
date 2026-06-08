import HomeProductRail from "../components/HomeProductRail";

import type { HomeProduct } from "../data/home-page-data";

type PopularProductsSectionProps = {
  products: HomeProduct[];
};

export default function PopularProductsSection({
  products,
}: PopularProductsSectionProps) {
  return (
    <HomeProductRail
      eyebrow="Customer favorites"
      title="Popular across the marketplace."
      description="A flexible section for best sellers, trending products, recently viewed items, or personalized recommendations."
      products={products}
      action={{
        label: "Explore products",
        href: "/shop",
      }}
    />
  );
}
