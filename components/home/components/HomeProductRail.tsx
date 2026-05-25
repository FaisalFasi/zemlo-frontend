import HomeProductCarousel from "./HomeProductCarousel";
import HomeSectionHeader from "./HomeSectionHeader";

import type { HomeProduct } from "../data/home-page-data";

type HomeProductRailProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  products: HomeProduct[];
  action?: {
    label: string;
    href: string;
  };
  surface?: "default" | "muted";
};

export default function HomeProductRail({
  eyebrow,
  title,
  description,
  products,
  action,
  surface = "default",
}: HomeProductRailProps) {
  return (
    <section
      className={
        surface === "muted"
          ? "section-md bg-surface-muted"
          : "section-md bg-background"
      }
    >
      <div className="container-page">
        <HomeSectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
        />

        <HomeProductCarousel products={products} label={title} />
      </div>
    </section>
  );
}
