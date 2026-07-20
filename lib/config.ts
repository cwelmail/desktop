const PROD_API_BASE = "https://api.aeri.rest/api/v1"

/** Same-origin `/api/v1` only under Next/Electron `http(s)://localhost` (proxied). Packaged `app://` uses the real API. */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location
    if (
      (protocol === "http:" || protocol === "https:") &&
      (hostname === "localhost" || hostname === "127.0.0.1")
    ) {
      return "/api/v1"
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE || PROD_API_BASE
}
