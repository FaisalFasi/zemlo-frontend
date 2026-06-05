"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/src/lib/utils";

import type { ProductDetailImage } from "../types/product-detail.types";

type ProductImageGalleryProps = {
  images: ProductDetailImage[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const safeImages = useMemo(
    () =>
      images.length > 0
        ? images
        : [
            {
              id: "fallback",
              url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
              alt: productName,
            },
          ],
    [images, productName],
  );

  const [selectedImageId, setSelectedImageId] = useState(safeImages[0].id);

  const selectedImage =
    safeImages.find((image) => image.id === selectedImageId) ?? safeImages[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[5rem_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
        {safeImages.map((image) => {
          const active = image.id === selectedImage.id;

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImageId(image.id)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted transition-zemlo",
                active
                  ? "border-foreground"
                  : "border-border hover:border-foreground",
              )}
              aria-label={`View ${image.alt}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="5rem"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      <div className="order-1 relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted lg:order-2">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
