import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { HomeCategory } from "../data/home-page-data";

type HomeCategoryCardProps = {
  category: HomeCategory;
};

export default function HomeCategoryCard({ category }: HomeCategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="group block overflow-hidden rounded-[1.5rem] border border-border bg-card no-underline transition-zemlo hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-md">
          <Icon className="size-5" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-card-title text-foreground">{category.name}</h3>
          <ArrowUpRight className="size-4 text-muted-foreground transition-zemlo group-hover:text-foreground" />
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
