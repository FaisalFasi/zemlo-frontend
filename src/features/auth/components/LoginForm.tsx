"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/config";
import FormField from "@/shared/forms/FormField";
import { Button } from "@/shared/ui/button";

import { useLoginMutation } from "../hooks/use-customer-auth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";
import { authInputClassName } from "./auth-form-styles";
import PasswordInput from "./PasswordInput";
import { getSafeRedirectPath } from "../lib/safe-redirect";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(values);

      router.push(getSafeRedirectPath(window.location.search, routes.home));
      router.refresh();
    } catch {
      // Error is surfaced via loginMutation.error below.
    }
  }

  const errorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : "";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8"
    >
      <p className="text-eyebrow text-muted-foreground">Welcome back</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Sign in.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your cart follows you — anything you added as a guest stays with your
        account.
      </p>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
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

        <FormField
          htmlFor="password"
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
        </FormField>

        <div className="text-right">
          <Link
            href={routes.auth.forgotPassword}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-6 w-full rounded-full"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to Zemlo?{" "}
        <Link
          href={routes.auth.register}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
