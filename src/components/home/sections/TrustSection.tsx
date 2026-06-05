import { ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";

import { trustItems } from "../data/home-page-data";

const trustIcons = [Sparkles, ShoppingCart, ShieldCheck];

export default function TrustSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-page grid gap-0 md:grid-cols-3">
        {trustItems.map((item, index) => {
          const Icon = trustIcons[index] ?? Sparkles;

          return (
            <div
              key={item.title}
              className="border-border py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground">
                <Icon className="size-5" />
              </div>

              <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
