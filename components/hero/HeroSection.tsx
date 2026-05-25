import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { heroData } from "./hero.data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f4ef]">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-16 lg:py-16">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted-foreground">
            <span>Zemlo</span>
            <span>New season</span>
          </div>

          <div className="max-w-2xl py-20 lg:py-0">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {heroData.eyebrow}
            </p>

            <h1 className="max-w-4xl text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-[#111111]">
              {heroData.title}
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#5f5a52] sm:text-lg">
              {heroData.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={heroData.primaryAction.href}
                className="group inline-flex h-12 items-center justify-center gap-3 bg-[#111111] px-7 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#2b2b2b]"
              >
                {heroData.primaryAction.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href={heroData.secondaryAction.href}
                className="inline-flex h-12 items-center justify-center border border-[#111111]/20 px-7 text-sm font-medium uppercase tracking-[0.18em] text-[#111111] transition hover:border-[#111111] hover:bg-white/50"
              >
                {heroData.secondaryAction.label}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-[#111111]/10 pt-6 text-sm text-[#5f5a52]">
            {heroData.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-medium text-[#111111]">
                  {stat.value}
                </p>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[560px] bg-[#ded6ca] lg:min-h-screen">
          <img
            src={heroData.image}
            alt={heroData.imageAlt}
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-6 left-6 right-6 border border-white/25 bg-white/70 p-5 backdrop-blur-xl sm:bottom-10 sm:left-10 sm:right-auto sm:w-[360px]">
            <p className="text-xs uppercase tracking-[0.25em] text-[#6f6a62]">
              {heroData.feature.label}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
              {heroData.feature.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f5a52]">
              {heroData.feature.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
