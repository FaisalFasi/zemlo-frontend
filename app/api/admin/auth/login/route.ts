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

export async function POST(request: Request) {
  const body = await request.json();

  const backendResponse = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
