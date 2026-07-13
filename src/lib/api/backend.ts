import "server-only";

import { NextResponse } from "next/server";

import { serverConfig } from "@/shared/config/server";
import { getAdminSessionToken } from "@/lib/auth/admin-session-cookie";

type BackendMethod = "GET" | "POST" | "PATCH" | "DELETE";

type BackendNextOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type BackendFetchOptions = {
  method?: BackendMethod;
  path: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: BackendNextOptions;
};

type ProxyToBackendOptions = {
  method: BackendMethod;
  path: string;
  includeBody?: boolean;
};

export function createBackendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${serverConfig.apiBaseUrl}${normalizedPath}`;
}

export async function readBackendResponse(response: Response) {
  const contentType = response.headers.get("content-type");

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

function createBackendHeaders(headers?: HeadersInit, body?: unknown) {
  return {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };
}

export async function backendFetch<TResponse>({
  method = "GET",
  path,
  body,
  headers,
  cache,
  next,
}: BackendFetchOptions): Promise<TResponse> {
  const response = await fetch(createBackendUrl(path), {
    method,
    headers: createBackendHeaders(headers, body),
    body: body ? JSON.stringify(body) : undefined,
    ...(cache ? { cache } : {}),
    ...(next ? { next } : {}),
  });

  const responseBody = await readBackendResponse(response);

  if (!response.ok) {
    throw responseBody;
  }

  return responseBody as TResponse;
}

async function readRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function proxyToBackend(
  request: Request,
  options: ProxyToBackendOptions,
) {
  // Prefer the httpOnly session cookie; fall back to an explicit header.
  const sessionToken = await getAdminSessionToken();
  const authorization = sessionToken
    ? `Bearer ${sessionToken}`
    : request.headers.get("authorization");
  const guestId = request.headers.get("x-guest-id");

  const body = options.includeBody ? await readRequestBody(request) : undefined;

  const response = await fetch(createBackendUrl(options.path), {
    method: options.method,
    headers: createBackendHeaders(
      {
        ...(authorization ? { Authorization: authorization } : {}),
        ...(guestId ? { "x-guest-id": guestId } : {}),
      },
      body,
    ),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const responseBody = await readBackendResponse(response);
  if (responseBody !== null && typeof responseBody === "object") {
    return NextResponse.json(responseBody, {
      status: response.status,
    });
  }

  if (typeof responseBody === "string") {
    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return new Response(null, {
    status: response.status,
  });
}
