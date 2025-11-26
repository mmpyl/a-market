import { NextRequest } from 'next/server';
import { requestMiddleware } from '@/lib/api-utils';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { hashString } from '@/lib/server-utils';
import { authCrudOperations } from '@/lib/auth';
import { userRegisterCallback } from '@/lib/user-register';

/**
 * Development endpoint to add a user without email verification
 * Only for development purposes - remove in production
 */
export const POST = requestMiddleware(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { email, password, role = 'vendedor' } = body;

    if (!email || !password) {
      return createErrorResponse({
        errorMessage: 'Email and password are required',
        status: 400,
      });
    }

    const { usersCrud } = await authCrudOperations();

    // Check if user already exists
    const existingUser = await usersCrud.findMany({
      email: email
    });

    if (existingUser && existingUser.length > 0) {
      return createErrorResponse({
        errorMessage: 'User already exists',
        status: 409,
      });
    }

    const hashedPassword = await hashString(password);

    const userData = {
      email: email,
      password: hashedPassword,
    };

    const user = await usersCrud.create(userData);

    // Create user profile with specified role
    await userRegisterCallback({
      ...user,
      role: role
    });

    return createSuccessResponse({
      data: {
        id: user.id,
        email: user.email,
        role: role
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return createErrorResponse({
      errorMessage: 'Failed to create user',
      status: 500,
    });
  }
}, false);
