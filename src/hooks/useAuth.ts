import { Permission } from '@/constants/permissions';
import { Role } from '@/constants/roles';
import { hasPermission } from '@/lib/auth/permissions';
import { refreshTokens, verifyToken } from '@/lib/auth/session';
import { User } from '@/types/auth';
import { useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const result = await verifyToken(token);
        if (result.valid && result.payload) {
          setUser({
            id: result.payload.sub,
            email: result.payload.email,
            role: result.payload.role as Role,
            isAdmin: result.payload.isAdmin,
          });
        } else if (result.code === 'TOKEN_EXPIRED') {
          await refreshAuth();
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would typically call an API endpoint
      // For now, we'll assume the login is handled elsewhere
      await checkAuthStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const newTokens = await refreshTokens(refreshToken);
        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        await checkAuthStatus();
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await logout();
    }
  };

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return {
    user,
    login,
    logout,
    refreshAuth,
    isAuthenticated: !!user,
    isLoading,
    hasPermission: checkPermission,
  };
}
