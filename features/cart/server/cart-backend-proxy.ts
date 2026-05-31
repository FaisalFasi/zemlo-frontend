import { NextResponse } from "next/server";

const DEFAULT_API_BASE_URL = "http://localhost:3000";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_API_BASE_URL
  );
}

async function readRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

async function readBackendResponse(response: Response) {
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

type ProxyCartRequestOptions = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  backendPath: string;
  includeBody?: boolean;
};

export async function proxyCartRequest(
  request: Request,
  options: ProxyCartRequestOptions,
) {
  const guestId = request.headers.get("x-guest-id");
  const authorization = request.headers.get("authorization");
  const body = options.includeBody ? await readRequestBody(request) : undefined;

  const backendResponse = await fetch(
    `${getApiBaseUrl()}${options.backendPath}`,
    {
      method: options.method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(guestId ? { "x-guest-id": guestId } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
  );

  const responseBody = await readBackendResponse(backendResponse);

  if (
    responseBody &&
    typeof responseBody === "object" &&
    !Array.isArray(responseBody)
  ) {
    return NextResponse.json(responseBody, {
      status: backendResponse.status,
    });
  }

  return new Response(typeof responseBody === "string" ? responseBody : null, {
    status: backendResponse.status,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
