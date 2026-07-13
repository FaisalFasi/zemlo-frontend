"use client";

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

function getErrorMessage(errorBody: unknown, fallback: string) {
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

type AdminApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

// Auth rides on the httpOnly session cookie (sent automatically on
// same-origin requests); the proxy route attaches the bearer token.
export async function adminApiRequest<TResponse>(
  path: string,
  options: AdminApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Admin session expired. Please login again.");
  }

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseBody, "Admin request failed."));
  }

  return responseBody as TResponse;
}
