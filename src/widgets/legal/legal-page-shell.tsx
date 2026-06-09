import type { ReactNode } from "react";

import { PageHeader } from "@/shared/ui/page-header";

type LegalPageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function LegalPageShell({
  eyebrow = "Legal",
  title,
  description,
  children,
}: LegalPageShellProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <article className="mx-auto mt-12 max-w-3xl space-y-8 text-sm leading-7 text-muted-foreground">
        {children}
      </article>
    </main>
  );
}
