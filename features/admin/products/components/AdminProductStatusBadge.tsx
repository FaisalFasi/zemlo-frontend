import { cn } from "@/lib/utils";

import type { AdminProductStatus } from "../types/admin-product.types";

type AdminProductStatusBadgeProps = {
  status: AdminProductStatus;
};

export default function AdminProductStatusBadge({
  status,
}: AdminProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        status === "ACTIVE" && "bg-success-soft text-success",
        status === "DRAFT" && "bg-warning-soft text-warning",
        status === "ARCHIVED" && "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
