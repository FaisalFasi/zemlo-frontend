import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/shared/ui/button";

type HomeEmptyProductsProps = {
  title?: string;
  description?: string;
};

export default function HomeEmptyProducts({
  title = "Products are being prepared.",
  description = "Categories are already available, and products will appear here once they are added from the admin dashboard.",
}: HomeEmptyProductsProps) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageSearch className="size-6" />
      </div>

      <h3 className="mt-5 text-xl font-medium tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <Button asChild variant="outline" className="mt-6 rounded-full">
        <Link href="/categories">Explore categories</Link>
      </Button>
    </div>
  );
}
