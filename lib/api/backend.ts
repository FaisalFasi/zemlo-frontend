import "server-only";

import { NextResponse } from "next/server";

import { serverConfig } from "@/config/server";

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
  const authorization = request.headers.get("authorization");
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

  if (
    responseBody &&
    typeof responseBody === "object" &&
    !Array.isArray(responseBody)
  ) {
    return NextResponse.json(responseBody, {
      status: response.status,
    });
  }

  return new Response(typeof responseBody === "string" ? responseBody : null, {
    status: response.status,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
