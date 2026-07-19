import AccountPanel from "@/features/auth/components/AccountPanel";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Account",
  description: "Manage your Zemlo account.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container-page mx-auto max-w-2xl py-10 md:py-14">
        <AccountPanel />
      </section>
    </main>
  );
}
