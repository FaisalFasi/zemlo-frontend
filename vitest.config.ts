/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Vitest (test runner) ki config — "@/" import alias ko
 * src/ par map karti hai (tsconfig jaisa hi) aur batati hai ke tests
 * src ke andar *.test.ts files mein hain.
 * REASON: Iske baghair tests mein "@/shared/..." imports fail hote.
 * Environment "node" hai kyunke pehla batch pure-logic tests ka hai
 * (formatters, filters, schemas) — DOM ki zaroorat nahi; component
 * tests ke waqt jsdom add hoga.
 * RISK: Zero — sirf tooling config.
 * ═════════════════════════════════════════════════════════════════
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
