import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';

export const runtime = 'edge';

export const GET = async (request: NextRequest) => {
  try {
    // For development, return mock user data based on cookie
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return createErrorResponse({
        errorMessage: 'No authentication token',
        status: 401,
      });
    }

    // Extract user info from token (mock implementation)
    let mockUser;
    if (accessToken.includes('admin@adminmarket.com')) {
      mockUser = {
        email: 'admin@adminmarket.com',
        rol_sistema: 'administrador',
        id: 1,
      };
    } else if (accessToken.includes('vendedor@adminmarket.com')) {
      mockUser = {
        email: 'vendedor@adminmarket.com',
        rol_sistema: 'vendedor',
        id: 2,
      };
    } else if (accessToken.includes('almacen@adminmarket.com')) {
      mockUser = {
        email: 'almacen@adminmarket.com',
        rol_sistema: 'almacenero',
        id: 3,
      };
    } else if (accessToken.includes('auditor@adminmarket.com')) {
      mockUser = {
        email: 'auditor@adminmarket.com',
        rol_sistema: 'auditor',
        id: 4,
      };
    } else {
      mockUser = {
        email: 'admin@adminmarket.com',
        rol_sistema: 'administrador',
        id: 1,
      };
    }

    return createSuccessResponse(mockUser);

  } catch (error) {
    console.error('Error in auth/user:', error);
    return createErrorResponse({
      errorMessage: 'Failed to obtain user information',
      status: 500,
    });
  }
};
