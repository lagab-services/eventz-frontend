interface RequestConfig extends RequestInit {
    method: string;
    headers: Record<string, string>;
}

interface RequestOptions {
    data?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    timeout?: number;
    [key: string]: unknown;
}

interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: RequestConfig;
}

interface ApiError extends Error {
    status?: number;
    statusText?: string;
    response?: Response;
    data?: unknown;
    code?: string;
}
export class APIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

class RestApi {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;
    private interceptors: {
        request: RequestInterceptor[];
        response: ResponseInterceptor[];
    };

    constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
        this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
        this.interceptors = {
            request: [],
            response: []
        };
    }

    /**
     * Set authentication token
     * @param {string} token - Access token
     * @param {string} type - Token type (Bearer, Basic, etc.)
     */
    setAuth(token: string, type: string = 'Bearer'): this {
        this.defaultHeaders['Authorization'] = `${type} ${token}`;
        return this;
    }

    /**
     * Remove authentication
     */
    removeAuth(): this {
        delete this.defaultHeaders['Authorization'];
        return this;
    }

    /**
     * Set default headers
     * @param {Object} headers - Headers object
     */
    setHeaders(headers: Record<string, string>): this {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
        return this;
    }

    /**
     * Add request interceptor
     * @param {Function} interceptor - Function to modify request config
     */
    addRequestInterceptor(interceptor: RequestInterceptor): this {
        this.interceptors.request.push(interceptor);
        return this;
    }

    /**
     * Add response interceptor
     * @param {Function} interceptor - Function to modify response
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): this {
        this.interceptors.response.push(interceptor);
        return this;
    }

    /**
     * Build full URL
     * @param {string} endpoint - API endpoint
     */
    private buildURL(endpoint: string): string {
        if (endpoint.startsWith('http')) {
            return endpoint;
        }
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return this.baseURL ? `${this.baseURL}/${cleanEndpoint}` : cleanEndpoint;
    }

    /**
     * Process request config through interceptors
     * @param {Object} config - Request configuration
     */
    private async processRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
        let processedConfig = { ...config };

        for (const interceptor of this.interceptors.request) {
            processedConfig = await interceptor(processedConfig) || processedConfig;
        }

        return processedConfig;
    }

    /**
     * Process response through interceptors
     * @param {Response} response - Fetch response
     */
    private async processResponseInterceptors(response: Response): Promise<Response> {
        let processedResponse = response;

        for (const interceptor of this.interceptors.response) {
            processedResponse = await interceptor(processedResponse) || processedResponse;
        }

        return processedResponse;
    }

    /**
     * Make HTTP request
     * @param {string} method - HTTP method
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     */
    async request<T = unknown>(
        method: string,
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            data,
            headers = {},
            params = {},
            timeout = 30000,
            ...otherOptions
        } = options;

        // Build URL with query parameters
        const url = new URL(this.buildURL(endpoint));
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, String(params[key]));
            }
        });

        // Prepare request config
        let config: RequestConfig = {
            method: method.toUpperCase(),
            headers: { ...this.defaultHeaders, ...headers },
            ...otherOptions
        };

        // Add body for methods that support it
        if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            if (data instanceof FormData) {
                // Remove Content-Type for FormData (browser will set it with boundary)
                delete config.headers['Content-Type'];
                config.body = data;
            } else if (typeof data === 'object') {
                config.body = JSON.stringify(data);
            } else {
                config.body = data;
            }
        }

        // Process request interceptors
        config = await this.processRequestInterceptors(config);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        config.signal = controller.signal;

        try {
            let response = await fetch(url.toString(), config);
            clearTimeout(timeoutId);

            // Process response interceptors
            response = await this.processResponseInterceptors(response);

            // Handle HTTP errors
            if (!response.ok) {
                const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`) as ApiError;
                error.status = response.status;
                error.statusText = response.statusText;
                error.response = response;

                try {
                    error.data = await response.json();
                } catch {
                    error.data = await response.text();
                }

                throw error;
            }

            let responseData: T;

            if (response.status === 204) {
                // 204 No Content - no content to parse
                responseData = null as T;
            } else {
                // Parse response based on content type
                const contentType = response.headers.get('content-type') || '';

                if (contentType.includes('application/json')) {
                    responseData = await response.json();
                } else if (contentType.includes('text/')) {
                    responseData = await response.text() as T;
                } else {
                    responseData = await response.blob() as T;
                }
            }

            return {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                config
            };

        } catch (error) {
            clearTimeout(timeoutId);

            if ((error as Error).name === 'AbortError') {
                const timeoutError = new Error('Request timeout') as ApiError;
                timeoutError.code = 'TIMEOUT';
                throw timeoutError;
            }

            throw error;
        }
    }

    /**
     * GET request
     */
    get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint, options);
    }

    /**
     * POST request
     */
    post<T = unknown>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, { ...options, data });
    }

    /**
     * PUT request
     */
    put<T = unknown>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('PUT', endpoint, { ...options, data });
    }

    /**
     * PATCH request
     */
    patch<T = unknown>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('PATCH', endpoint, { ...options, data });
    }

    /**
     * DELETE request
     */
    delete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('DELETE', endpoint, options);
    }

    /**
     * HEAD request
     */
    head<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('HEAD', endpoint, options);
    }

    /**
     * OPTIONS request
     */
    options<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>('OPTIONS', endpoint, options);
    }
}

// Factory function for creating API instances
function createAPI(baseURL: string = '', defaultHeaders: Record<string, string> = {}): RestApi {
    return new RestApi(baseURL, defaultHeaders);
}

// Default instance for internal Next.js API
const apiClient = createAPI(process.env.BACKEND_URL || '/api', {});

// Instance for external APIs
const externalAPI = createAPI('', {});

// ES6 export for Next.js
export { RestApi, createAPI, apiClient, externalAPI };
export type { RequestConfig, RequestOptions, ApiResponse, ApiError, RequestInterceptor, ResponseInterceptor };
export default apiClient;


/*
USAGE EXAMPLES IN NEXT.JS:

// ===== In a page or component =====
import { apiClient, externalAPI } from '@/lib/api';

// Usage with internal Next.js API
const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// ===== In app/api/users.ts (API Route) =====
import { externalAPI } from '@/lib/api';

export default async function handler(req, res) {
  // Configuration for external API
  externalAPI.setAuth(process.env.EXTERNAL_API_TOKEN);

  try {
    const response = await externalAPI.get('https://jsonplaceholder.typicode.com/users');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ===== In a custom hook =====
// hooks/useAPI.js
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export function useAPI(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(endpoint, options);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// ===== Global configuration in _app.js =====
// pages/_app.js
import { apiClient } from '@/lib/api';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Global API configuration
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setAuth(token);
    }

    // Global interceptor to handle authentication
    apiClient.addResponseInterceptor(async (response) => {
      if (response.status === 401) {
        // Redirect to login if token expired
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return response;
    });
  }, []);

  return <Component {...pageProps} />;
}

// ===== Usage in getServerSideProps =====
export async function getServerSideProps(context) {
  const { externalAPI } = await import('@/lib/api');

  try {
    const response = await externalAPI.get('https://api.example.com/data');

    return {
      props: {
        data: response.data
      }
    };
  } catch (error) {
    return {
      props: {
        data: null,
        error: error.message
      }
    };
  }
}
*/