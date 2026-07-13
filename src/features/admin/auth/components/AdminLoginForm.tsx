"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { loginAdmin, logoutAdmin } from "../api/admin-auth-api";
import { canAccessAdmin } from "../lib/admin-permissions";

function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export default function AdminLoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const result = await loginAdmin({
        email: getFormValue(formData, "email"),
        password: getFormValue(formData, "password"),
      });

      if (!canAccessAdmin(result.user)) {
        // Drop the session cookie, otherwise middleware would bounce this
        // non-admin user between /admin and /admin/login forever.
        await logoutAdmin();
        setError("Your account does not have admin access.");
        return;
      }

      const from = new URLSearchParams(window.location.search).get("from");

      router.push(from?.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8"
    >
      <p className="text-eyebrow text-muted-foreground">Zemlo Admin</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Sign in to admin.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Use your admin account. Staff roles will be permission-controlled as the
        dashboard grows.
      </p>

      {error ? (
        <div className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="h-11 w-full rounded-full border border-border bg-background px-4 pr-12 text-sm outline-none focus:border-foreground"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
