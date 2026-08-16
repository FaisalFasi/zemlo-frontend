import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Forgot password",
  description: "Reset your Zemlo account password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
