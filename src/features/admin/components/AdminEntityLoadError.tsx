type AdminEntityLoadErrorProps = {
  message: string;
  onRetry: () => void;
};

// Shared "could not load X — Try again" row used by every admin list
// screen that reads from a TanStack Query.
export default function AdminEntityLoadError({
  message,
  onRetry,
}: AdminEntityLoadErrorProps) {
  return (
    <p className="mt-5 text-sm text-muted-foreground">
      {message}{" "}
      <button
        type="button"
        onClick={onRetry}
        className="font-medium text-foreground underline underline-offset-4"
      >
        Try again
      </button>
    </p>
  );
}
