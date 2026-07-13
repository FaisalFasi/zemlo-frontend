import LoginForm from "@/features/auth/components/LoginForm";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Sign in",
  description: "Sign in to your Zemlo account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginForm />;
}
