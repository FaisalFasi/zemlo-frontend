import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

export default function PublicNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center px-4 py-16 text-center">
      <PageHeader
        eyebrow="404"
        title="Page not found."
        description="The page you are looking for does not exist or may have moved."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href={routes.shop}>Shop products</Link>
        </Button>

        <Button asChild variant="outline" className="rounded-full">
          <Link href={routes.home}>Back home</Link>
        </Button>
      </div>
    </main>
  );
}
