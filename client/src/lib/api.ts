import { apiRequest } from "./queryClient";
import { useAuth } from "@/hooks/use-auth";

// --- Environment Variable Setup ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.MODE !== "production") {
  console.warn(
    "VITE_API_BASE_URL is not set in .env file. API calls might fail or use relative paths."
  );
}

function getFullApiUrl(path: string): string {
  if (!API_BASE_URL) {
    console.error("VITE_API_BASE_URL is missing!");
    throw new Error("Backend API base URL is not configured.");
  }
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}/public${formattedPath}`;
}

// --- API Response & Type Definitions ---

export interface ApiResponse<T> {
  data: T;
  meta: {
    success: boolean;
    message: string;
    error_code?: string | null;
  };
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  } | null;
}

export interface News {
  id_news: string;
  title: string;
  content: string;
  image_url: string;
  status: string;
  published_at?: string | Date;
  author_name: string;
  created_on: string | Date;
  updated_on: string | Date;
}

export interface Event {
  id_event: string;
  title: string;
  content: string;
  summary?: string;
  slug?: string;
  image_url: string;
  event_date: string;
  location: string;
  status: string;
  published_at?: string;
  author_name: string;
  created_on: string;
  updated_on: string;
}

export interface Destination {
  id_destination: string;
  id_gate: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  features?: string;
  facilities?: string;
  status: number;
  created_on: string;
  updated_on: string;
  gate?: { name: string };
  summary?: string;
}

export interface BookingItem {
  quantity: number;
  id_ticket_price: string;
}

export interface Booking {
  id_booking: string;
  leader_name: string;
  leader_gender: string | null;
  leader_nationality: string;
  leader_phone: string;
  leader_id_number: string;
  leader_id_type: string;
  visit_date: string | null;
  total_amount: string;
  status: string;
  created_on: string;
  updated_on: string;
  expired_at?: string;
  paid_at?: string;
  payment_gateway_token?: string;
  items: BookingItem[];
}

// --- ADDED: Query Parameters Type ---
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: any;
}

// --- Generic API Helpers ---

const handleResponse = async <T>(res: Response): Promise<T> => {
  let errorBody: any = null;
  try {
    errorBody = await res.json();
  } catch (e) {
    if (!res.ok) {
      throw new Error(res.statusText || "Network error without JSON body");
    }
    return {} as T;
  }

  if (!res.ok) {
    const errorMessage =
      errorBody?.meta?.message ||
      errorBody?.message ||
      "An unknown API error occurred";
    console.error("API Error Response:", errorBody);
    throw new Error(errorMessage);
  }
  return errorBody;
};

// --- ADDED: Helper to create URL with query parameters ---
const createUrlWithParams = (baseUrl: string, params: QueryParams = {}) => {
  const query = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      query.append(key, String(params[key]));
    }
  }
  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// --- API Endpoint Functions ---

export const newsApi = {
  // UPDATED: getAllNews now accepts pagination parameters
  getAllNews: (params: QueryParams = {}) =>
    apiRequest("GET", createUrlWithParams(getFullApiUrl("/news"), params)).then(
      handleResponse<ApiResponse<News[]>>
    ),
  getNewsById: (id: string) =>
    apiRequest("GET", getFullApiUrl(`/news/${id}`)).then(
      handleResponse<ApiResponse<News>>
    ),
};

// --- DITAMBAHKAN: Objek API untuk Event ---
export const eventApi = {
  getAllEvents: (params: QueryParams = {}) =>
    apiRequest(
      "GET",
      createUrlWithParams(getFullApiUrl("/events"), params)
    ).then(handleResponse<ApiResponse<Event[]>>),
};

export const destinationApi = {
  getAllDestination: (params: QueryParams = {}) =>
    apiRequest(
      "GET",
      createUrlWithParams(getFullApiUrl("/destinations"), params)
    ).then(handleResponse<ApiResponse<Destination[]>>),
  getDestination: (identifier: string) =>
    apiRequest("GET", getFullApiUrl(`/destinations/slug/${identifier}`)).then(
      handleResponse<ApiResponse<Destination>>
    ),
};


export const bookingApi = {
  getAllBookings: async (params: any, options?: any) => {
    // ✅ Build the full correct URL
    const url = createUrlWithParams(getFullApiUrl("/bookings"), params);

    // ✅ Call apiRequest normally
    const response = await apiRequest("GET", url, {
      headers: options?.headers,
    });

    // ✅ Parse the response using your handleResponse
    return handleResponse<ApiResponse<Booking[]>>(response);
  },

    // ✅ New endpoint: getBookingById
    // ✅ New endpoint: getBookingById
  getBookingById: (id: string, options?: any) => {
    const url = getFullApiUrl(`/bookings/${id}`);
    return apiRequest("GET", url, {
      headers: options?.headers,
    }).then(handleResponse<ApiResponse<Booking>>);
  },

  // ✅ New endpoint: retryPayment
  retryPayment: (id: string, options?: any) => {
    const url = getFullApiUrl(`/midtrans/retry/{${id}}`);
    return apiRequest("POST", url, {
      headers: options?.headers,
    }).then(handleResponse<ApiResponse<{ transactionToken: string }>>);
  },
};




export function authHeaders(token?: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// optional hook helper for queries/mutations
export function useApiBase() {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const { token } = useAuth();
  return {
    base,
    token,
    headers: authHeaders(token),
  };
}
