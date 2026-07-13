import RegisterForm from "@/features/auth/components/RegisterForm";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Create account",
  description: "Create your Zemlo account.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return <RegisterForm />;
}
