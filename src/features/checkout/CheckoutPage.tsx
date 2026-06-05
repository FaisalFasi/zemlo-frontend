"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import FormField from "@/components/forms/FormField";
import FormStatusMessage from "@/components/forms/FormStatusMessage";
import { useCart } from "@/features/cart/hooks/use-cart";

import CheckoutCartSummary from "./components/CheckoutCartSummary";
import CheckoutSuccessPanel from "./components/CheckoutSuccessPanel";
import { useCheckoutFromCartMutation } from "./hooks/use-checkou";
import { checkoutFormValuesToInput } from "./lib/checkout-mappers";
import {
  checkoutDefaultValues,
  checkoutSchema,
  type CheckoutFormInput,
  type CheckoutFormValues,
} from "./schemas/checkout.schema";
import type { CheckoutFromCartResponse } from "./types/checkout.types";

export default function CheckoutPage() {
  const { cart, isCartLoading, cartError } = useCart();

  const checkoutMutation = useCheckoutFromCartMutation();

  const form = useForm<CheckoutFormInput, undefined, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: CheckoutFormValues) {
    const payload = checkoutFormValuesToInput(values);

    await checkoutMutation.mutateAsync(payload);
  }

  const checkoutResult = checkoutMutation.data as
    | CheckoutFromCartResponse
    | undefined;

  const mutationError =
    checkoutMutation.error instanceof Error
      ? checkoutMutation.error.message
      : "";

  const isCartEmpty = !cart || cart.items.length === 0;
  const canSubmit = !isCartLoading && !isCartEmpty && !isSubmitting;

  if (checkoutResult) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10 md:py-14">
          <CheckoutSuccessPanel result={checkoutResult} />
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <section className="container-page py-10 md:py-14">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-zemlo hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to cart
        </Link>

        <div className="mb-8">
          <p className="text-eyebrow text-muted-foreground">Checkout</p>

          <h1 className="mt-3 text-section-title">
            Complete your shipping details.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            This creates an order from your current cart and receives the Stripe
            PaymentIntent client secret from your backend.
          </p>
        </div>

        {cartError ? (
          <div className="mb-6">
            <FormStatusMessage
              type="error"
              title="Cart could not be loaded"
              message={cartError}
            />
          </div>
        ) : null}

        {mutationError ? (
          <div className="mb-6">
            <FormStatusMessage
              type="error"
              title="Checkout was not created"
              message={mutationError}
            />
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"
          noValidate
        >
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Contact
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <FormField
                  htmlFor="email"
                  label="Email"
                  error={errors.email?.message}
                  className="md:col-span-2"
                >
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="guest@example.com"
                    {...register("email")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="firstName"
                  label="First name"
                  error={errors.firstName?.message}
                >
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    {...register("firstName")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="lastName"
                  label="Last name"
                  error={errors.lastName?.message}
                >
                  <input
                    id="lastName"
                    autoComplete="family-name"
                    {...register("lastName")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="phone"
                  label="Phone"
                  error={errors.phone?.message}
                  className="md:col-span-2"
                >
                  <input
                    id="phone"
                    autoComplete="tel"
                    placeholder="+13001234567"
                    {...register("phone")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Shipping address
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <FormField
                  htmlFor="street"
                  label="Street address"
                  error={errors.street?.message}
                  className="md:col-span-2"
                >
                  <input
                    id="street"
                    autoComplete="address-line1"
                    {...register("street")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="apartment"
                  label="Apartment, suite, etc."
                  error={errors.apartment?.message}
                  className="md:col-span-2"
                >
                  <input
                    id="apartment"
                    autoComplete="address-line2"
                    {...register("apartment")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="city"
                  label="City"
                  error={errors.city?.message}
                >
                  <input
                    id="city"
                    autoComplete="address-level2"
                    {...register("city")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="state"
                  label="State"
                  error={errors.state?.message}
                >
                  <input
                    id="state"
                    autoComplete="address-level1"
                    {...register("state")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="zipCode"
                  label="ZIP / postal code"
                  error={errors.zipCode?.message}
                >
                  <input
                    id="zipCode"
                    autoComplete="postal-code"
                    {...register("zipCode")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="country"
                  label="Country code"
                  error={errors.country?.message}
                >
                  <input
                    id="country"
                    maxLength={2}
                    autoComplete="country"
                    {...register("country")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm uppercase outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="company"
                  label="Company"
                  error={errors.company?.message}
                  className="md:col-span-2"
                >
                  <input
                    id="company"
                    autoComplete="organization"
                    {...register("company")}
                    className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </FormField>

                <FormField
                  htmlFor="customerNote"
                  label="Order note"
                  error={errors.customerNote?.message}
                  className="md:col-span-2"
                >
                  <textarea
                    id="customerNote"
                    rows={4}
                    placeholder="Please call before delivery"
                    {...register("customerNote")}
                    className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                  />
                </FormField>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <CheckoutCartSummary cart={cart} isLoading={isCartLoading} />

            <aside className="rounded-[2rem] border border-border bg-card p-6">
              <p className="text-eyebrow text-muted-foreground">Payment</p>

              <h2 className="mt-3 text-xl font-medium tracking-tight">
                Stripe PaymentIntent
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This step creates the order and receives the Stripe client
                secret. Stripe Elements will be connected next.
              </p>

              <div className="mt-5 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                Payment method:{" "}
                <span className="font-medium text-foreground">STRIPE</span>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit || checkoutMutation.isPending}
                className="mt-6 w-full rounded-full"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating checkout...
                  </>
                ) : (
                  "Create checkout"
                )}
              </Button>

              {isCartEmpty ? (
                <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                  Add products to cart before checkout.
                </p>
              ) : null}
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}
