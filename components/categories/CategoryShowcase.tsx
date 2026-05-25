import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { categoryShowcaseData } from "./category.data";

export function CategoryShowcase() {
  return (
    <section className="bg-[#f7f4ef] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#817a70]">
              Shop by mood
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Built around how people actually dress.
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#111111]"
          >
            Explore all
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {categoryShowcaseData.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative min-h-[460px] overflow-hidden bg-[#e8e1d7]"
            >
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.25em] opacity-80">
                  Zemlo edit
                </p>
                <h3 className="mt-2 text-3xl font-medium tracking-[-0.05em]">
                  {category.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
                  {category.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
