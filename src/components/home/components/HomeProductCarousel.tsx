"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

import HomeProductCard from "./HomeProductCard";
import type { HomeProduct } from "../data/home-page-data";

type HomeProductCarouselProps = {
  products: HomeProduct[];
  label: string;
};

export default function HomeProductCarousel({
  products,
  label,
}: HomeProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

    setCanScrollPrevious(scroller.scrollLeft > 4);
    setCanScrollNext(scroller.scrollLeft < maxScrollLeft - 4);
  }, []);

  const scrollByDirection = (direction: "previous" | "next") => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    const scrollAmount = scroller.clientWidth * 0.85;

    scroller.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);

    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateScrollState);
    };
  }, [products.length, updateScrollState]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Scroll ${label} products left`}
          disabled={!canScrollPrevious}
          onClick={() => scrollByDirection("previous")}
          className="rounded-full"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Scroll ${label} products right`}
          disabled={!canScrollNext}
          onClick={() => scrollByDirection("next")}
          className="rounded-full"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div
        ref={scrollerRef}
        aria-label={label}
        className="grid auto-cols-[78%] grid-flow-col gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:auto-cols-[46%] md:auto-cols-[31%] lg:auto-cols-[23%] xl:auto-cols-[20%] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-0 snap-start">
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
