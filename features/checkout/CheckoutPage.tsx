"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import CheckoutSuccessPanel from "./components/CheckoutSuccessPanel";
import type {
  CheckoutFromCartInput,
  CheckoutFromCartResponse,
} from "./types/checkout.types";
import { checkoutFromCart } from "./api/checkout.api";

const DEFAULT_COUNTRY = "US";

function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function buildCheckoutPayload(formData: FormData): CheckoutFromCartInput {
  const guestFirstName = getFormValue(formData, "firstName");
  const guestLastName = getFormValue(formData, "lastName");
  const guestPhone = getFormValue(formData, "phone");

  const shippingAddress = {
    firstName: guestFirstName,
    lastName: guestLastName,
    company: getFormValue(formData, "company") || undefined,
    phone: guestPhone,
    street: getFormValue(formData, "street"),
    apartment: getFormValue(formData, "apartment") || undefined,
    city: getFormValue(formData, "city"),
    state: getFormValue(formData, "state"),
    zipCode: getFormValue(formData, "zipCode"),
    country: getFormValue(formData, "country") || DEFAULT_COUNTRY,
  };

  return {
    guestEmail: getFormValue(formData, "email"),
    guestPhone,
    guestFirstName,
    guestLastName,
    shippingAddress,
    paymentMethod: "STRIPE",
    customerNote: getFormValue(formData, "customerNote") || undefined,
  };
}

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] =
    useState<CheckoutFromCartResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setCheckoutResult(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = buildCheckoutPayload(formData);
      const result = await checkoutFromCart(payload);

      setCheckoutResult(result);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create checkout.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
            This creates an order from the current cart and receives the Stripe
            PaymentIntent client secret from your backend.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]"
        >
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Contact
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="guest@example.com"
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+13001234567"
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Shipping address
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="street">Street address</label>
                  <input
                    id="street"
                    name="street"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="apartment">Apartment, suite, etc.</label>
                  <input
                    id="apartment"
                    name="apartment"
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="zipCode">ZIP / postal code</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    required
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="country">Country code</label>
                  <input
                    id="country"
                    name="country"
                    required
                    defaultValue={DEFAULT_COUNTRY}
                    maxLength={2}
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm uppercase outline-none focus:border-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="customerNote">Order note</label>
                  <textarea
                    id="customerNote"
                    name="customerNote"
                    rows={4}
                    placeholder="Please call before delivery"
                    className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 lg:sticky lg:top-[calc(var(--navbar-height)+2rem)]">
            <p className="text-eyebrow text-muted-foreground">Payment</p>

            <h2 className="mt-3 text-xl font-medium tracking-tight">
              Stripe PaymentIntent
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This step creates the order and receives the client secret. Stripe
              Elements will be connected next.
            </p>

            <div className="mt-5 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              Payment method:{" "}
              <span className="font-medium text-foreground">STRIPE</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating checkout...
                </>
              ) : (
                "Create checkout"
              )}
            </Button>
          </aside>
        </form>
      </section>
    </main>
  );
}
