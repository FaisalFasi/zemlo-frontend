import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata = createPageMetadata({
  title: "Reset password",
  description: "Choose a new password for your Zemlo account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
