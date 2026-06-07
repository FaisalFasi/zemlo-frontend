import { defineConfig } from "orval";

const apiSpecUrl =
  process.env.ORVAL_API_SPEC_URL_LOCAL_HOST ??
  "https://zemlo-store.onrender.com/api-json";

console.log("ORVAL_API_SPEC_URL_LOCAL_HOST---:", apiSpecUrl);

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
