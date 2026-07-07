type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl space-y-4 text-center">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
        {title}
      </h1>

      {description ? (
        <p className="text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
