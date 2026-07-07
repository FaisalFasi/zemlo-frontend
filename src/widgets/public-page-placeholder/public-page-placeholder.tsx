import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

type PublicPagePlaceholderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  note?: string;
};

export function PublicPagePlaceholder({
  eyebrow = "Zemlo",
  title,
  description,
  note = "This page is part of the public storefront foundation and will be expanded later.",
}: PublicPagePlaceholderProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col justify-center px-4 py-16 md:py-24">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm leading-6 text-muted-foreground">{note}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link href={routes.shop}>Shop products</Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full">
            <Link href={routes.home}>Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
