import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfoPanel from "./components/ProductInfoPanel";

import type { ProductDetail } from "./types/product-detail.types";

type ProductDetailPageProps = {
  product: ProductDetail;
};

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <main className="bg-background text-foreground">
      <section className="container-page py-8 md:py-12">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-zemlo hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
          <ProductInfoPanel product={product} />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
            <p className="text-eyebrow text-muted-foreground">
              Product details
            </p>

            <div className="prose-zemlo mt-4">
              <p className="leading-8 text-muted-foreground">
                {product.description}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
            <p className="text-eyebrow text-muted-foreground">Specifications</p>

            <div className="mt-5 divide-y divide-border">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="text-right font-medium text-foreground">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
