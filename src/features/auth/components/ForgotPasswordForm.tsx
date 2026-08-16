"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/config";
import FormField from "@/shared/forms/FormField";
import { Button } from "@/shared/ui/button";

import { useForgotPasswordMutation } from "../hooks/use-customer-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schemas";
import { authInputClassName } from "./auth-form-styles";

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPasswordMutation.mutateAsync(values.email);
    } catch {
      // A genuine failure (network/server) is surfaced via
      // forgotPasswordMutation.error below. A resolved request always
      // means "check your email" — the backend never reveals whether the
      // account exists.
    }
  }

  const errorMessage =
    forgotPasswordMutation.error instanceof Error
      ? forgotPasswordMutation.error.message
      : "";

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
        <p className="text-eyebrow text-muted-foreground">Check your email</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          Reset link sent.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password. It may take a few minutes to arrive.
        </p>

        <Button asChild className="mt-6 w-full rounded-full">
          <Link href={routes.auth.login}>Back to sign in</Link>
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
      <p className="text-eyebrow text-muted-foreground">Forgot password</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Reset your password.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6">
        <FormField
          htmlFor="email"
          label="Email"
          error={form.formState.errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={authInputClassName}
            {...form.register("email")}
          />
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="mt-6 w-full rounded-full"
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link
          href={routes.auth.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
