import type { ReactNode } from "react";

import FieldInfo from "../FieldInfo";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  htmlFor?: string;
  label: string;
  error?: string;
  info?: {
    title: string;
    description: string;
    example?: string;
  };
  children: ReactNode;
  className?: string;
};

export default function FormField({
  htmlFor,
  label,
  error,
  info,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={htmlFor}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        {label}

        {info ? (
          <FieldInfo
            title={info.title}
            description={info.description}
            example={info.example}
          />
        ) : null}
      </label>

      <div className="mt-2">{children}</div>

      {error ? (
        <p className="mt-2 text-xs leading-5 text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
