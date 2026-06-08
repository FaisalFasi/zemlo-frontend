import axios from "axios";

import {
  apiConfig,
  apiContentTypes,
  apiHeaders,
  storageKeys,
} from "@/shared/config";
import { getOrCreateGuestId } from "@/shared/lib/guest-id";

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function getBaseURL() {
  if (typeof window !== "undefined") {
    return apiConfig.browserBackendProxyBaseUrl;
  }

  return removeTrailingSlash(
    process.env.API_BASE_URL ?? apiConfig.defaultBackendBaseUrl,
  );
}

function getStoredAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(storageKeys.adminAccessToken) ?? "";
  } catch {
    return "";
  }
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  headers: {
    [apiHeaders.accept]: apiContentTypes.json,
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const adminToken = getStoredAdminToken();
  const guestId = getOrCreateGuestId();

  if (adminToken) {
    config.headers.set(apiHeaders.authorization, `Bearer ${adminToken}`);
  }

  if (guestId) {
    config.headers.set(apiHeaders.guestId, guestId);
  }

  return config;
});
