import { NextRequest } from "next/server";
import { createErrorResponse, createAuthResponse } from "@/lib/create-response";
import { getDevUsers } from "@/lib/dev-users";
import { z } from "zod";

export const runtime = 'edge';

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Please provide the password."),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // En desarrollo, usar usuarios de prueba
    // En producción, validar contra base de datos
    const testUsers = getDevUsers();

    if (testUsers.length === 0) {
      return createErrorResponse({
        errorMessage: "Test users not available in this environment",
        status: 403,
      });
    }

    const user = testUsers.find(
      u => u.email === validatedData.email && u.password === validatedData.password
    );

    if (user) {
      // Mock tokens for development with user email embedded
      const accessToken = `mock_access_token_${Date.now()}_${user.email}`;
      const refreshToken = `mock_refresh_token_${Date.now()}_${user.email}`;

      return createAuthResponse({
        accessToken,
        refreshToken,
        user: {
          email: user.email,
          rol_sistema: user.rol_sistema,
          id: testUsers.indexOf(user) + 1
        }
      });
    }

    return createErrorResponse({
      errorMessage: "Invalid email or password",
      status: 401,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse({
        errorMessage: error.errors[0].message,
        status: 400,
      });
    }

    return createErrorResponse({
      errorMessage: "Login failed. Please try again later",
      status: 500,
    });
  }
};
