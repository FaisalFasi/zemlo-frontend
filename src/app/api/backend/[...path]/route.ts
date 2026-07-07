import { NextResponse } from "next/server";

import { apiContentTypes, apiHeaders } from "@/shared/config/api";
import { serverConfig } from "@/shared/config/server";

type BackendProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

async function readRequestBody(request: Request) {
  if (METHODS_WITHOUT_BODY.has(request.method)) {
    return undefined;
  }

  const body = await request.arrayBuffer();

  return body.byteLength > 0 ? body : undefined;
}

function createBackendUrl(pathSegments: string[], request: Request) {
  const path = pathSegments.join("/");
  const requestUrl = new URL(request.url);

  return `${serverConfig.apiBaseUrl}/${path}${requestUrl.search}`;
}

function createProxyHeaders(request: Request, hasBody: boolean) {
  const headers = new Headers();

  headers.set(apiHeaders.accept, apiContentTypes.json);

  const contentType = request.headers.get(apiHeaders.contentType);
  const authorization = request.headers.get(apiHeaders.authorization);
  const guestId = request.headers.get(apiHeaders.guestId);

  if (hasBody) {
    headers.set(apiHeaders.contentType, contentType || apiContentTypes.json);
  }

  if (authorization) {
    headers.set(apiHeaders.authorization, authorization);
  }

  if (guestId) {
    headers.set(apiHeaders.guestId, guestId);
  }

  return headers;
}

async function proxyRequest(request: Request, context: BackendProxyContext) {
  const { path } = await context.params;
  const body = await readRequestBody(request);

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
      [apiHeaders.contentType]:
        backendResponse.headers.get(apiHeaders.contentType) ??
        apiContentTypes.json,
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
