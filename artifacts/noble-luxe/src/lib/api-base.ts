const PUBLISHED_API_BASE_URL =
  "https://noble-luxe-api-and-checkout--donaldmilles56.replit.app";

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (typeof configured === "string" && configured.trim()) {
    return configured.trim().replace(/\/+$/, "");
  }

  if (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith(".github.io")
  ) {
    return PUBLISHED_API_BASE_URL;
  }

  return "";
}

export function apiUrl(path: string): string {
  return getApiBaseUrl() + path;
}
