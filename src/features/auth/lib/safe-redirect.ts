// Only allow same-site relative paths from ?from= — anything else (absolute
// URLs, protocol-relative "//evil.com") would be an open-redirect hole.
export function getSafeRedirectPath(search: string, fallback: string) {
  const from = new URLSearchParams(search).get("from");

  if (from && from.startsWith("/") && !from.startsWith("//")) {
    return from;
  }

  return fallback;
}
