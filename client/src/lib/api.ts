import { apiRequest } from "./queryClient";

// --- Environment Variable Setup ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.MODE !== 'production') {
  console.warn("VITE_API_BASE_URL is not set in .env file. API calls might fail or use relative paths.");
}

function getFullApiUrl(path: string): string {
  if (!API_BASE_URL) {
     console.error("VITE_API_BASE_URL is missing!");
     throw new Error("Backend API base URL is not configured.");
  }
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
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
            throw new Error(res.statusText || 'Network error without JSON body');
        }
        return {} as T;
    }

    if (!res.ok) {
        const errorMessage = errorBody?.meta?.message || errorBody?.message || 'An unknown API error occurred';
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
}

// --- API Endpoint Functions ---

export const newsApi = {
  // UPDATED: getAllNews now accepts pagination parameters
  getAllNews: (params: QueryParams = {}) =>
    apiRequest("GET", createUrlWithParams(getFullApiUrl("/news"), params)).then(handleResponse<ApiResponse<News[]>>),
};
