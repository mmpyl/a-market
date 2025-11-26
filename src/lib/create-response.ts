import { NextResponse } from 'next/server';

export function createSuccessResponse<T = any>(data: { data: T; message?: string }, status: number = 200) {
  return NextResponse.json({
    success: true,
    data: data.data,
    message: data.message,
  }, { status });
}

export function createErrorResponse(data: { errorMessage: string; status: number; errorCode?: string }) {
  return NextResponse.json(
    {
      success: false,
      errorMessage: data.errorMessage,
      errorCode: data.errorCode,
    },
    { status: data.status }
  );
}

export function createAuthResponse(data: { accessToken: string; refreshToken: string; user?: any }) {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      },
      user: data.user,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `access_token=${data.accessToken}; Path=/; HttpOnly; SameSite=strict; Max-Age=86400`,
        'Set-Cookie': `refresh_token=${data.refreshToken}; Path=/; HttpOnly; SameSite=strict; Max-Age=604800`,
      },
    }
  );
}

export function createLogoutResponse() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Set-Cookie', 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=strict');
  headers.set('Set-Cookie', 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=strict');

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Logged out successfully',
    }),
    {
      status: 200,
      headers,
    }
  );
}
