import axios from "axios";

import { apiConfig } from "@/shared/config/api";
import { storageKeys } from "@/shared/config/storage-keys";
import { getOrCreateGuestId } from "@/shared/lib/guest-id";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return apiConfig.browserBackendProxyBaseUrl;
  }

  return (process.env.API_BASE_URL ?? apiConfig.defaultBackendBaseUrl).replace(
    /\/$/,
    "",
  );
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const adminToken = window.localStorage.getItem(storageKeys.adminAccessToken);
  const guestId = getOrCreateGuestId();

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  if (guestId) {
    config.headers["x-guest-id"] = guestId;
  }

  return config;
});
