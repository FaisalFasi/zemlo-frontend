import "server-only";

const DEFAULT_API_BASE_URL = "http://localhost:3000";

function readStringEnv(key: string, fallback?: string) {
  const value = process.env[key]?.trim();

  if (value) return value;

  if (fallback !== undefined) return fallback;

  throw new Error(`Missing required environment variable: ${key}`);
}

function readBooleanEnv(key: string, fallback = false) {
  const value = process.env[key]?.trim().toLowerCase();

  if (!value) return fallback;

  return value === "true";
}

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export const serverConfig = Object.freeze({
  apiBaseUrl: removeTrailingSlash(
    readStringEnv("API_BASE_URL", DEFAULT_API_BASE_URL),
  ),

  demoCatalogEnabled: readBooleanEnv("DEMO_CATALOG_ENABLED", false),

  nodeEnv: readStringEnv("NODE_ENV", "development"),
});

export type ServerConfig = typeof serverConfig;
