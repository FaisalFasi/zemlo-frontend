import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type HomeSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
};

export default function HomeSectionHeader({
  eyebrow,
  title,
  description,
  action,
}: HomeSectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
        ) : null}

        <h2 className="mt-3 text-section-title text-foreground">{title}</h2>

        {description ? (
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="text-ui inline-flex items-center gap-2 text-foreground underline underline-offset-4"
        >
          {action.label}
          <ArrowUpRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
