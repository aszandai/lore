export function getApiUrl() {
  if (typeof window === "undefined") {
    // Server-side (in dev container)
    return process.env.NEXT_PUBLIC_API_URL || "http://backend:5000";
  }
  // Client-side (browser)
  return "http://localhost:5000";
}