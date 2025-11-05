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


export const apiRequest = async (
method: string, fullUrl: string, options?: {
  data?: unknown;
  headers?: HeadersInit;
}, p0?: Record<string, string>): Promise<Response> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  const response = await fetch(fullUrl, {
    method,
    headers: defaultHeaders,
    body: options?.data ? JSON.stringify(options.data) : undefined,
  });

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