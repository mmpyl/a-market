import { AUTH_CODE } from '@/constants/auth';

/**
 * Standard API response structure for all API endpoints
 * @template T - The type of data returned in successful responses
 */
interface ApiResponse<T = any> {
  /** Indicates if the API call was successful */
  success: boolean;
  /** The response data (only present when success is true) */
  data?: T;
  /** Optional success message */
  message?: string;
  /** Error message (only present when success is false) */
  errorMessage?: string;
  /** Error code for programmatic error handling */
  errorCode?: string;
}

/**
 * Custom error class for API-related errors
 * Extends the built-in Error class with HTTP status and error code information
 */
class ApiError extends Error {
<<<<<<< HEAD
  /** HTTP status code of the error */
  public status: number;
  /** Human-readable error message */
  public errorMessage: string;
  /** Optional error code for programmatic handling */
  public errorCode?: string;

  /**
   * Creates a new ApiError instance
   * @param status - HTTP status code
   * @param errorMessage - Human-readable error message
   * @param errorCode - Optional error code for programmatic handling
   */
  constructor(status: number, errorMessage: string, errorCode?: string) {
    super(errorMessage);
    this.name = 'ApiError';
    this.status = status;
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }
}

/** Flag to prevent multiple simultaneous token refresh attempts */
=======
  constructor(
    public status: number,
    public errorMessage: string,
    public errorCode?: string
  ) {
    super(errorMessage);
    this.name = 'ApiError';
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// Estado del refresh token
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
let isRefreshing = false;
/** Promise that resolves when token refresh is complete */
let refreshPromise: Promise<boolean> | null = null;

/**
<<<<<<< HEAD
 * Attempts to refresh the authentication token
 * @returns Promise<boolean> - True if refresh was successful, false otherwise
=======
 * Intenta refrescar el token de autenticación
 * @returns Promise<boolean> - true si el refresh fue exitoso
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
 */
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/next-api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para cookies
    });

    if (!response.ok) {
      return false;
    }

    const result: ApiResponse = await response.json();
<<<<<<< HEAD

    if (result.success) {
      return true;
    }

    return false;
=======
    return result.success === true;
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
<<<<<<< HEAD
 * Redirects the user to the login page with the current path as a redirect parameter
 * Only works in browser environment (client-side)
 */
function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if(currentPath === '/login' || currentPath === '/login/') {
      return;
    }
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
=======
 * Redirige al usuario a la página de login
 * Preserva la ruta actual para redirección post-login
 */
function redirectToLogin(): void {
  if (typeof window === 'undefined') {
    return;
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
  }

  const currentPath = window.location.pathname;
  
  // No redirigir si ya estamos en login
  if (currentPath === '/login' || currentPath === '/login/') {
    return;
  }

  const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
  window.location.href = loginUrl;
}

/**
<<<<<<< HEAD
 * Core API request function with automatic token refresh and error handling
 * @template T - The expected return type of the API response data
 * @param endpoint - API endpoint path (will be prefixed with '/next-api')
 * @param options - Fetch API options (headers, method, etc.)
 * @param isRetry - Internal flag to prevent infinite retry loops during token refresh
 * @returns Promise<T> - Resolves with the response data or rejects with ApiError
=======
 * Realiza una petición HTTP a la API con manejo automático de refresh token
 * @param endpoint - Ruta del endpoint (sin /next-api)
 * @param options - Opciones de fetch
 * @param isRetry - Indica si es un reintento después de refresh
 * @returns Promise<T> - Datos de respuesta tipados
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
 */
async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false
): Promise<T> {
  try {
    const response = await fetch(`/next-api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include', // Importante para cookies
      ...options,
    });

    const result: ApiResponse<T> = await response.json();

<<<<<<< HEAD
    if (result.errorCode === AUTH_CODE.TOKEN_MISSING) {
=======
    // Token faltante - redirigir inmediatamente
    if ([AUTH_CODE.TOKEN_MISSING].includes(result.errorCode || '')) {
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
      redirectToLogin();
      throw new ApiError(401, result.errorMessage || 'Token missing', result.errorCode);
    }

    // Token expirado - intentar refresh
    if (
      response.status === 401 &&
      result.errorCode === AUTH_CODE.TOKEN_EXPIRED &&
      !isRetry
    ) {
      // Si ya hay un refresh en proceso, esperar a que termine
      if (isRefreshing && refreshPromise) {
        const refreshSuccess = await refreshPromise;
        
        if (refreshSuccess) {
          return apiRequest<T>(endpoint, options, true);
        } else {
          redirectToLogin();
          throw new ApiError(401, 'Session expired', result.errorCode);
        }
      }

      // Iniciar nuevo proceso de refresh
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken();

        try {
          const refreshSuccess = await refreshPromise;

          if (refreshSuccess) {
            // Reintentar request original
            return apiRequest<T>(endpoint, options, true);
          } else {
            redirectToLogin();
            throw new ApiError(401, 'Failed to refresh token', result.errorCode);
          }
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    // Error de respuesta
    if (!response.ok || !result.success) {
      throw new ApiError(
        response.status,
        result.errorMessage || 'API Error',
        result.errorCode
      );
    }

    return result.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Error de red u otro tipo de error
    console.error('API request error:', error);
    throw new ApiError(500, 'Network error or invalid response');
  }
}

/**
<<<<<<< HEAD
 * Centralized API client with automatic authentication handling
 * Provides HTTP methods (GET, POST, PUT, DELETE) with built-in token refresh
 */
export const api = {
  /**
   * Performs a GET request to the specified endpoint
   * @template T - Expected response data type
   * @param endpoint - API endpoint path (without '/next-api' prefix)
   * @param params - Optional query parameters as key-value pairs
   * @returns Promise<T> - Resolves with response data or rejects with ApiError
=======
 * Cliente API con métodos HTTP
 */
export const api = {
  /**
   * Petición GET
   * @param endpoint - Ruta del endpoint
   * @param params - Query parameters opcionales
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
   */
  get: <T = any>(endpoint: string, params?: Record<string, string>) => {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return apiRequest<T>(url, { method: 'GET' });
  },

  /**
<<<<<<< HEAD
   * Performs a POST request to the specified endpoint
   * @template T - Expected response data type
   * @param endpoint - API endpoint path (without '/next-api' prefix)
   * @param data - Request body data to be JSON serialized
   * @returns Promise<T> - Resolves with response data or rejects with ApiError
=======
   * Petición POST
   * @param endpoint - Ruta del endpoint
   * @param data - Datos a enviar en el body
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
   */
  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
<<<<<<< HEAD
   * Performs a PUT request to the specified endpoint
   * @template T - Expected response data type
   * @param endpoint - API endpoint path (without '/next-api' prefix)
   * @param data - Request body data to be JSON serialized
   * @returns Promise<T> - Resolves with response data or rejects with ApiError
=======
   * Petición PUT
   * @param endpoint - Ruta del endpoint
   * @param data - Datos a actualizar
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
   */
  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
<<<<<<< HEAD
   * Performs a DELETE request to the specified endpoint
   * @template T - Expected response data type
   * @param endpoint - API endpoint path (without '/next-api' prefix)
   * @returns Promise<T> - Resolves with response data or rejects with ApiError
=======
   * Petición PATCH
   * @param endpoint - Ruta del endpoint
   * @param data - Datos a actualizar parcialmente
   */
  patch: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * Petición DELETE
   * @param endpoint - Ruta del endpoint
>>>>>>> b56bb2660ccc262165432c47aa3d633b47d49077
   */
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { ApiError };
export type { ApiResponse };
