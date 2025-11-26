import { AUTH_CODE } from '@/constants/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Validate environment variables
export function validateEnv() {
  const requiredEnvVars = [
    'POSTGREST_URL',
    'POSTGREST_SCHEMA',
    'POSTGREST_API_KEY',
    'JWT_SECRET',
    'SCHEMA_ADMIN_USER',
    'HASH_SALT_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
}

class ApiError extends Error {
  constructor(public status: number, public errorMessage: string, public errorCode?: string) {
    super(errorMessage);
    this.name = 'ApiError';
  }
}

// Cookie utilities
export function setCookie(
  response: Response,
  name: string,
  value: string,
  options: {
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
  } = {}
) {
  const { path = '/', httpOnly = true, secure = false, sameSite = 'strict', maxAge } = options;

  let cookie = `${name}=${value}; Path=${path}; HttpOnly=${httpOnly}; SameSite=${sameSite}`;

  if (secure) {
    cookie += '; Secure';
  }

  if (maxAge) {
    cookie += `; Max-Age=${maxAge}`;
  }

  response.headers.set('Set-Cookie', cookie);
}

export function clearCookie(response: Response, name: string, path: string = '/') {
  response.headers.set('Set-Cookie', `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly=true; SameSite=strict`);
}

// Get cookies from request
export function getCookies(request: NextRequest, names: string[]): string[] {
  const cookies = request.headers.get('cookie') || '';
  return names.map(name => {
    const match = cookies.match(new RegExp(`(?:^|; )${name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
  });
}

// Redirect response
export function responseRedirect(url: string, redirectUrl?: string): NextResponse {
  return NextResponse.redirect(redirectUrl || url);
}

// Parse query parameters
export function parseQueryParams(request: NextRequest): { limit?: number; offset?: number; search?: string; id?: string } {
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
  const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : undefined;
  const search = url.searchParams.get('search') || undefined;
  const id = url.searchParams.get('id') || undefined;
  return { limit, offset, search, id };
}

// Request middleware for API routes
export function requestMiddleware(
  handler: (request: NextRequest, context: { token?: string; payload?: any }) => Promise<Response>,
  requireAuth: boolean = true
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      let context: { token?: string; payload?: any } = {};

      if (requireAuth) {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(
            JSON.stringify({
              success: false,
              errorMessage: 'Authorization token required',
              errorCode: 'TOKEN_MISSING',
            }),
            {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const token = authHeader.substring(7);
        const { verifyToken } = await import('./auth');
        const verification = await verifyToken(token);

        if (!verification.valid) {
          return new Response(
            JSON.stringify({
              success: false,
              errorMessage: 'Invalid or expired token',
              errorCode: verification.code,
            }),
            {
              status: verification.code === 'TOKEN_EXPIRED' ? 401 : 401,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        context = {
          token,
          payload: verification.payload,
        };
      }

      return await handler(request, context);
    } catch (error) {
      console.error('Request middleware error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          errorMessage: 'Internal server error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Validate request body
export async function validateRequestBody(request: NextRequest): Promise<any> {
  try {
    const body = await request.json();
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

// Get request IP address
export function getRequestIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default or localhost
  return '127.0.0.1';
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Sistema Minimarket <noreply@tu-dominio.com>',
      to: [email],
      subject: 'Código de Verificación - Sistema Minimarket',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Código de Verificación</h2>
          <p>Hola,</p>
          <p>Tu código de verificación para el Sistema Minimarket es:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 24px; font-weight: bold; color: #2563eb;">${code}</span>
          </div>
          <p>Este código expirará en 10 minutos.</p>
          <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Sistema de Gestión Minimarket<br>
            Todos los derechos reservados.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/next_api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const result: ApiResponse = await response.json();

    if (result.success) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if(currentPath === '/login' || currentPath === '/login/') {
      return;
    }
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false
): Promise<T> {
  try {
    const response = await fetch(`/next_api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const result: ApiResponse<T> = await response.json();

    if ([AUTH_CODE.TOKEN_MISSING].includes(result.errorCode || '')) {
      redirectToLogin();
      return result.data as T;
    }

    if (response.status === 401 &&
        result.errorCode === AUTH_CODE.TOKEN_EXPIRED &&
        !isRetry) {

      if (isRefreshing && refreshPromise) {
        const refreshSuccess = await refreshPromise;
        if (refreshSuccess) {
          return apiRequest<T>(endpoint, options, true);
        } else {
          redirectToLogin();
          return result.data as T;
        }
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken();

        try {
          const refreshSuccess = await refreshPromise;

          if (refreshSuccess) {
            return apiRequest<T>(endpoint, options, true);
          } else {
            redirectToLogin();
            return result.data as T;
          }
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    if(!response.ok || !result.success) {
      throw new ApiError(response.status, result.errorMessage || 'API Error', result.errorCode);
    }

    return result.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or invalid response');
  }
}

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string>) => {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return apiRequest<T>(url, { method: 'GET' });
  },

  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { ApiError };
export type { ApiResponse };
