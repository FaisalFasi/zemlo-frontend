export const apiConfig = Object.freeze({
  defaultBackendBaseUrl: "http://localhost:3000",
  browserBackendProxyBaseUrl: "/api/backend",
  openApiJsonPath: "/api-json",
  swaggerUiPath: "/api",
} as const);

export type ApiConfig = typeof apiConfig;
