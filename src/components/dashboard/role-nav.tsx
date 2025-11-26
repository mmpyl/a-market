
'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut, BarChart3, Package, ShoppingCart, FileText, Settings } from 'lucide-react';

export function RoleNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const getRoleLabel = (rol: string | undefined) => {
    const roles: Record<string, string> = {
      vendedor: 'Vendedor',
      almacenero: 'Almacenero',
      administrador: 'Administrador',
      auditor: 'Auditor',
    };
    return roles[rol || ''] || 'Usuario';
  };

  const getRoleIcon = (rol: string | undefined) => {
    switch (rol) {
      case 'vendedor':
        return <ShoppingCart className="w-5 h-5" />;
      case 'almacenero':
        return <Package className="w-5 h-5" />;
      case 'administrador':
        return <Settings className="w-5 h-5" />;
      case 'auditor':
        return <FileText className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getRoleIcon(user.rol_sistema)}
          <div>
            <h1 className="font-bold text-lg">Minimarket</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getRoleLabel(user.rol_sistema)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.nombre_completo || user.email}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </div>
      </div>
    </nav>
  );
}
