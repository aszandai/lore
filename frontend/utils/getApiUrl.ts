export function getApiUrl(endpoint = "") {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let baseUrl: string;

  try {
    const url = new URL(envUrl);

    if (url.hostname === "backend" && process.env.NODE_ENV !== "production") {
      url.hostname = "localhost";
    }

    baseUrl = url.toString();
  } catch {
    baseUrl = envUrl;
  }

  if (endpoint) {
    return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  }
  return baseUrl;
}
