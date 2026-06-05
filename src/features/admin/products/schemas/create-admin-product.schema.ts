import { z } from "zod";

const optionalString = (min: number, max: number, label: string) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .min(min, `${label} must be at least ${min} characters.`)
      .max(max, `${label} must be at most ${max} characters.`)
      .optional(),
  );

const optionalNumber = (label: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      return Number(value);
    },
    z
      .number({
        error: `${label} must be a valid number.`,
      })
      .min(0, `${label} cannot be negative.`)
      .optional(),
  );

const requiredNumber = (label: string) =>
  z.preprocess(
    (value) => Number(value),
    z
      .number({
        error: `${label} must be a valid number.`,
      })
      .min(0, `${label} cannot be negative.`),
  );

export const createAdminProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters.")
      .max(200, "Product name must be at most 200 characters."),

    slug: optionalString(2, 220, "Slug"),

    sku: optionalString(2, 100, "SKU"),

    categoryId: z.string().uuid("Please select a valid category."),

    brandId: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().uuid("Please select a valid brand.").optional(),
    ),

    shortDescription: optionalString(2, 500, "Short description"),

    description: optionalString(2, 5000, "Description"),

    price: requiredNumber("Price"),

    compareAtPrice: optionalNumber("Compare at price"),

    costPrice: optionalNumber("Cost price"),

    stock: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return 0;
        }

        return Number(value);
      },
      z
        .number({
          error: "Stock must be a valid number.",
        })
        .int("Stock must be a whole number.")
        .min(0, "Stock cannot be negative."),
    ),

    status: z.enum(["ACTIVE", "DRAFT"]),

    isFeatured: z.boolean(),

    trackInventory: z.boolean(),

    allowBackorder: z.boolean(),

    imageUrl: z
      .string()
      .trim()
      .min(5, "Image URL is required.")
      .max(1000, "Image URL is too long.")
      .url("Please enter a valid image URL."),

    imageAlt: optionalString(2, 200, "Image alt text"),

    keywordsText: z.string().optional(),

    metaTitle: optionalString(2, 200, "Meta title"),

    metaDescription: optionalString(2, 500, "Meta description"),

    weight: optionalNumber("Weight"),

    length: optionalNumber("Length"),

    width: optionalNumber("Width"),

    height: optionalNumber("Height"),
  })
  .superRefine((values, context) => {
    if (
      values.compareAtPrice !== undefined &&
      values.compareAtPrice <= values.price
    ) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Compare at price should be greater than selling price.",
      });
    }

    if (values.costPrice !== undefined && values.costPrice > values.price) {
      context.addIssue({
        code: "custom",
        path: ["costPrice"],
        message:
          "Cost price is higher than selling price. Check this before saving.",
      });
    }
  });

export type CreateAdminProductFormInput = z.input<
  typeof createAdminProductSchema
>;

export type CreateAdminProductFormValues = z.output<
  typeof createAdminProductSchema
>;

export const createAdminProductDefaultValues: CreateAdminProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  brandId: "",
  shortDescription: "",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  costPrice: undefined,
  stock: 10,
  status: "ACTIVE",
  isFeatured: false,
  trackInventory: true,
  allowBackorder: false,
  imageUrl: "",
  imageAlt: "",
  keywordsText: "",
  metaTitle: "",
  metaDescription: "",
  weight: undefined,
  length: undefined,
  width: undefined,
  height: undefined,
};
