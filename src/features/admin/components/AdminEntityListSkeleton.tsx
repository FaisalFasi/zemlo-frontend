type AdminEntityListSkeletonProps = {
  rows?: number;
};

// Shared loading placeholder for admin list screens (categories, brands,
// variants, ...) — one look, not re-styled per manager.
export default function AdminEntityListSkeleton({
  rows = 3,
}: AdminEntityListSkeletonProps) {
  return (
    <div className="mt-5 space-y-2">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-xl border border-border bg-muted"
        />
      ))}
    </div>
  );
}
