export const apiConfig = Object.freeze({
  defaultBackendBaseUrl: "http://localhost:3000",
  browserBackendProxyBaseUrl: "/api/backend",
  openApiJsonPath: "/api-json",
  swaggerUiPath: "/api",
} as const);

export const apiHeaders = Object.freeze({
  accept: "Accept",
  authorization: "Authorization",
  contentType: "Content-Type",
  guestId: "x-guest-id",
} as const);

export const apiContentTypes = Object.freeze({
  json: "application/json",
} as const);

export type ApiConfig = typeof apiConfig;
