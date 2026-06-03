import "server-only";

import { ApiError } from "./api-error";
import { backendFetch } from "./backend";

type ApiFetchNextOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: ApiFetchNextOptions;
};

function getApiErrorMessage(errorBody: unknown, fallback: string) {
  if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
    const message = errorBody.message;

    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  if (typeof errorBody === "string" && errorBody.trim().length > 0) {
    return errorBody;
  }

  return fallback;
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  try {
    return await backendFetch<TResponse>({
      method: options.method,
      path,
      body: options.body,
      headers: options.headers,
      cache: options.cache,
      next: options.next,
    });
  } catch (errorBody) {
    throw new ApiError(
      getApiErrorMessage(errorBody, "Something went wrong while calling API."),
      500,
      "Backend API Error",
      errorBody,
    );
  }
}
