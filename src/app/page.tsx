
'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { RoleNav } from '@/components/dashboard/role-nav';
import { VendedorDashboard } from '@/components/dashboard/vendedor-dashboard';
import { AlmacenDashboard } from '@/components/dashboard/almacen-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { AuditorDashboard } from '@/components/dashboard/auditor-dashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.rol_sistema) {
      case 'vendedor':
        return <VendedorDashboard />;
      case 'almacenero':
        return <AlmacenDashboard />;
      case 'administrador':
        return <AdminDashboard />;
      case 'auditor':
        return <AuditorDashboard />;
      default:
        return <VendedorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <RoleNav />
      <main className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
