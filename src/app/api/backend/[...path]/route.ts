import { NextResponse } from "next/server";

import { serverConfig } from "@/shared/config/server";

type BackendProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function readRequestBody(request: Request) {
  const text = await request.text();

  return text.length > 0 ? text : undefined;
}

function createBackendUrl(pathSegments: string[], request: Request) {
  const path = pathSegments.join("/");
  const url = new URL(request.url);

  return `${serverConfig.apiBaseUrl}/${path}${url.search}`;
}

function createProxyHeaders(request: Request, hasBody: boolean) {
  const headers = new Headers();

  headers.set("Accept", "application/json");

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  const authorization = request.headers.get("authorization");
  const guestId = request.headers.get("x-guest-id");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  if (guestId) {
    headers.set("x-guest-id", guestId);
  }

  return headers;
}

async function proxyRequest(request: Request, context: BackendProxyContext) {
  const { path } = await context.params;

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await readRequestBody(request);

  const backendResponse = await fetch(createBackendUrl(path, request), {
    method: request.method,
    headers: createProxyHeaders(request, Boolean(body)),
    body,
    cache: "no-store",
  });

  const responseBody = await backendResponse.text();

  return new NextResponse(responseBody || null, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: Request, context: BackendProxyContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: BackendProxyContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: BackendProxyContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: BackendProxyContext) {
  return proxyRequest(request, context);
}
