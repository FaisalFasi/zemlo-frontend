import type { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
        {title}
      </h2>

      <div className="space-y-3">{children}</div>
    </section>
  );
}
