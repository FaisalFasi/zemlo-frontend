import axios from "axios";

import { apiConfig, apiContentTypes, apiHeaders } from "@/shared/config";
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

  const guestId = getOrCreateGuestId();

  if (guestId) {
    config.headers.set(apiHeaders.guestId, guestId);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Expired admin session: the proxy answers 401 — send the user back to login.
    if (
      typeof window !== "undefined" &&
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      window.location.pathname.startsWith("/admin")
    ) {
      window.location.assign("/admin/login");
    }

    return Promise.reject(error);
  },
);
