import { Permission, Role } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermission } from './permissions';
import { verifyToken } from './session';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
    isAdmin: boolean;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  requiredPermissions?: Permission[]
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Token de autorización requerido' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const tokenResult = await verifyToken(token);

      if (!tokenResult.valid) {
        return NextResponse.json(
          { error: 'Token inválido o expirado' },
          { status: 401 }
        );
      }

      const user = tokenResult.payload!;

      // Verificar permisos si se requieren
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(permission =>
          hasPermission(user.role, permission)
        );

        if (!hasRequiredPermissions) {
          return NextResponse.json(
            { error: 'Permisos insuficientes' },
            { status: 403 }
          );
        }
      }

      // Agregar usuario al request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: user.sub,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      };

      return handler(authenticatedReq);
    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  };
}

export function requireAuth(requiredPermissions?: Permission[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
    withAuth(handler, requiredPermissions);
}

export function requireAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(handler, []); // Los admins tienen todos los permisos
}
