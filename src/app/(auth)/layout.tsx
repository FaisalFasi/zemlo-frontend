import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="container-page py-6">
        <Link href="/" className="inline-flex items-center gap-2 no-underline">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            Z
          </span>
          <span className="font-display text-lg font-medium uppercase tracking-[0.22em] text-foreground">
            Zemlo
          </span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
