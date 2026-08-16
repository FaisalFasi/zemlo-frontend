export async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return null;
  }

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

// A gateway/host error page (backend cold-starting, proxy down) comes back
// as an HTML document, not JSON — never show that markup to the user.
function looksLikeUsableMessage(value: string): boolean {
  const trimmed = value.trim();

  return (
    trimmed.length > 0 &&
    trimmed.length <= 300 &&
    !/^<(!doctype|html)/i.test(trimmed)
  );
}

export function getErrorMessage(errorBody: unknown, fallback: string) {
  if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
    const message = errorBody.message;

    if (typeof message === "string" && looksLikeUsableMessage(message)) {
      return message;
    }
    if (Array.isArray(message)) return message.join(", ");
  }

  if (typeof errorBody === "string" && looksLikeUsableMessage(errorBody)) {
    return errorBody;
  }

  return fallback;
}
