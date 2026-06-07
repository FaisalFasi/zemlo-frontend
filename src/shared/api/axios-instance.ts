import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:3000";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }

  return (process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");
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

  const adminToken = window.localStorage.getItem("zemlo_admin_access_token");
  const guestId = window.localStorage.getItem("zemlo_guest_cart_id");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  if (guestId) {
    config.headers["x-guest-id"] = guestId;
  }

  return config;
});
