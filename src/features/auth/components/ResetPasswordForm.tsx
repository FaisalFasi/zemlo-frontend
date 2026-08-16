"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/config";
import FormField from "@/shared/forms/FormField";
import { Button } from "@/shared/ui/button";

import { useResetPasswordMutation } from "../hooks/use-customer-auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schemas";
import PasswordInput from "./PasswordInput";

export default function ResetPasswordForm() {
  const resetPasswordMutation = useResetPasswordMutation();

  // Read on mount, not during render — window isn't available during SSR,
  // and reading it in an effect avoids a hydration mismatch.
  const [token, setToken] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
    setTokenChecked(true);
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
    } catch {
      // Error surfaced via resetPasswordMutation.error below.
    }
  }

  const errorMessage =
    resetPasswordMutation.error instanceof Error
      ? resetPasswordMutation.error.message
      : "";

  if (tokenChecked && !token) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
        <p className="text-eyebrow text-muted-foreground">Invalid link</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          This reset link is missing its token.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Open the link from your email again, or request a new one.
        </p>

        <Button asChild className="mt-6 w-full rounded-full">
          <Link href={routes.auth.forgotPassword}>Request a new link</Link>
        </Button>
      </div>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
        <p className="text-eyebrow text-muted-foreground">
          Password updated
        </p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          You&apos;re all set.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your password has been changed. For security, you&apos;ll need to
          sign in again everywhere.
        </p>

        <Button asChild className="mt-6 w-full rounded-full">
          <Link href={routes.auth.login}>Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8"
    >
      <p className="text-eyebrow text-muted-foreground">Reset password</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Choose a new password.
      </h1>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <FormField
          htmlFor="newPassword"
          label="New password"
          error={form.formState.errors.newPassword?.message}
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            {...form.register("newPassword")}
          />
        </FormField>

        <FormField
          htmlFor="confirmPassword"
          label="Confirm password"
          error={form.formState.errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="mt-6 w-full rounded-full"
      >
        {resetPasswordMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save new password"
        )}
      </Button>
    </form>
  );
}
