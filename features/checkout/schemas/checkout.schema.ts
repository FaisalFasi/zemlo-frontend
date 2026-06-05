import { z } from "zod";

const optionalString = (max: number, label: string) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max, `${label} is too long.`).optional(),
  );

export const checkoutSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(80, "First name is too long."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(80, "Last name is too long."),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),

  company: optionalString(120, "Company"),

  street: z
    .string()
    .trim()
    .min(3, "Street address is required.")
    .max(180, "Street address is too long."),

  apartment: optionalString(120, "Apartment"),

  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .max(100, "City is too long."),

  state: z
    .string()
    .trim()
    .min(2, "State is required.")
    .max(100, "State is too long."),

  zipCode: z
    .string()
    .trim()
    .min(3, "ZIP/postal code is required.")
    .max(20, "ZIP/postal code is too long."),

  country: z
    .string()
    .trim()
    .min(2, "Country code is required.")
    .max(2, "Use a 2-letter country code, like US.")
    .transform((value) => value.toUpperCase()),

  customerNote: optionalString(500, "Order note"),
});

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormValues = z.output<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormInput = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  customerNote: "",
};
