import { defineConfig } from "orval";

const DEFAULT_API_SPEC_URL = "https://zemlo-store.onrender.com/api-json";

const apiSpecUrl = process.env.ORVAL_API_SPEC_URL ?? DEFAULT_API_SPEC_URL;

console.log("ORVAL_API_SPEC_URL:", apiSpecUrl);

export default defineConfig({
  zemlo: {
    input: {
      target: apiSpecUrl,
    },
    output: {
      mode: "tags-split",
      target: "src/shared/api/generated/zemlo.ts",
      schemas: "src/shared/api/generated/schemas",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/shared/api/axios-mutator.ts",
          name: "axiosMutator",
        },
      },
    },
  },
});
