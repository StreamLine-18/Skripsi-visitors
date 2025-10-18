import { QueryClient } from "@tanstack/react-query";

// Basic Query Client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Keep data fresh for a long time
      retry: false, // Don't retry failed requests automatically by default
    },
    mutations: {
      retry: false,
    },
  },
});

// Basic fetch function (can be used by api.ts)
// No token logic here, assuming public access or separate auth handling for visitors
export const apiRequest = async (
  method: string,
  fullUrl: string, // Expects the full URL now
  data?: unknown | undefined,
  headers: HeadersInit = {}
): Promise<Response> => {

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // No Authorization header added here for the visitor app by default

  const response = await fetch(fullUrl, {
    method,
    headers: defaultHeaders,
    body: data ? JSON.stringify(data) : undefined,
    // credentials: "omit", // Or 'same-origin' - check CORS needs
  });

  // Basic check before passing to handleResponse in api.ts
  // handleResponse will do the detailed error parsing
    // We return the raw response to be handled by `handleResponse` in api.ts
  return response;
};

// You might still need a multipart version if visitors upload files (unlikely now)
export const apiMultipartRequest = async (
    method: string,
    fullUrl: string, // Expects the full URL
    data: FormData,
    headers: HeadersInit = {}
  ): Promise<Response> => {

    const defaultHeaders: HeadersInit = {
      // Content-Type is set automatically by fetch for FormData
      ...headers,
    };

    // No Authorization header added here

    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      body: data,
      // credentials: "omit",
    });

    return response;
  };