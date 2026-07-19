/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Signup/login ke Zod validation rules ke tests.
 * REASON: Password rules backend (RegisterDto) ki mirror-copy hain —
 * ye tests dono ko sync rakhte hain. Rules dheele hue to backend
 * reject karega (double error UX), sakht hue to signup block.
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "./auth.schemas";

const validRegistration = {
  firstName: "Faisal",
  lastName: "Rehman",
  email: "test@example.com",
  password: "StrongPass1!",
  confirmPassword: "StrongPass1!",
};

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it.each([
    ["too short", "Ab1!"],
    ["no uppercase", "weakpass1!"],
    ["no lowercase", "WEAKPASS1!"],
    ["no digit", "WeakPass!!"],
    ["no special char", "WeakPass11"],
  ])("rejects password with %s", (_label, password) => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password,
      confirmPassword: password,
    });

    expect(result.success).toBe(false);
  });

  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      confirmPassword: "Different1!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects one-letter names and invalid emails", () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, firstName: "F" })
        .success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...validRegistration, email: "not-an-email" })
        .success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a valid email and any non-empty password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "x" }).success,
    ).toBe(true);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(
      false,
    );
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(
      false,
    );
  });
});
