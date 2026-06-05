"use client";

import { useId, useState } from "react";
import { HelpCircle, X } from "lucide-react";

import { cn } from "@/src/lib/utils";

type FieldInfoProps = {
  title: string;
  description: string;
  example?: string;
  className?: string;
};

export default function FieldInfo({
  title,
  description,
  example,
  className,
}: FieldInfoProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`More information about ${title}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-zemlo hover:bg-muted hover:text-foreground"
      >
        <HelpCircle className="size-4" />
      </button>

      {open ? (
        <span
          id={panelId}
          role="tooltip"
          className="absolute left-1/2 top-7 z-50 w-72 -translate-x-1/2 rounded-2xl border border-border bg-card p-4 text-left shadow-card"
        >
          <span className="flex items-start justify-between gap-3">
            <span className="text-sm font-medium text-foreground">{title}</span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close information"
            >
              <X className="size-3.5" />
            </button>
          </span>

          <span className="mt-2 block text-xs leading-5 text-muted-foreground">
            {description}
          </span>

          {example ? (
            <span className="mt-3 block rounded-xl bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
              <span className="font-medium text-foreground">Example:</span>{" "}
              {example}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
