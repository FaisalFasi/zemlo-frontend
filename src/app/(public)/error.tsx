"use client";

import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

type PublicErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function PublicError({ reset }: PublicErrorProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center px-4 py-16 text-center">
      <PageHeader
        eyebrow="Something went wrong"
        title="We could not load this page."
        description="Please try again. If the problem continues, the storefront may be temporarily unavailable."
      />

      <div className="mt-8">
        <Button type="button" className="rounded-full" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
