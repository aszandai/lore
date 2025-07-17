export function getApiUrl(endpoint = "") {
  const isServer = typeof window === 'undefined';
  
  let baseUrl: string;
  
  if (isServer) {
    // Server-side: use internal Docker network
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:5000";
  } else {
    // Client-side: use localhost
    baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('backend', 'localhost') || "http://localhost:5000";
  }

  if (endpoint) {
    return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  }
  return baseUrl;
}
