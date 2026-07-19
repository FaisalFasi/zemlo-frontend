"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/config";
import FormField from "@/shared/forms/FormField";
import { Button } from "@/shared/ui/button";

import { useRegisterMutation } from "../hooks/use-customer-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schemas";
import { authInputClassName } from "./auth-form-styles";
import PasswordInput from "./PasswordInput";
import { getSafeRedirectPath } from "../lib/safe-redirect";

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      router.push(getSafeRedirectPath(window.location.search, routes.home));
      router.refresh();
    } catch {
      // Error is surfaced via registerMutation.error below.
    }
  }

  const errorMessage =
    registerMutation.error instanceof Error
      ? registerMutation.error.message
      : "";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8"
    >
      <p className="text-eyebrow text-muted-foreground">Join Zemlo</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Create your account.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Track your orders and keep your cart across devices.
      </p>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            htmlFor="firstName"
            label="First name"
            error={form.formState.errors.firstName?.message}
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className={authInputClassName}
              {...form.register("firstName")}
            />
          </FormField>

          <FormField
            htmlFor="lastName"
            label="Last name"
            error={form.formState.errors.lastName?.message}
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className={authInputClassName}
              {...form.register("lastName")}
            />
          </FormField>
        </div>

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
            autoComplete="new-password"
            {...form.register("password")}
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
        disabled={registerMutation.isPending}
        className="mt-6 w-full rounded-full"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={routes.auth.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
