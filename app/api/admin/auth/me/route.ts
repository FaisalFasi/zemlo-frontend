import { NextResponse } from "next/server";

const DEFAULT_API_BASE_URL = "http://localhost:3000";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_API_BASE_URL
  );
}

async function readBody(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  return response.text();
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  const backendResponse = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    cache: "no-store",
  });

  const responseBody = await readBody(backendResponse);

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
  });
}
