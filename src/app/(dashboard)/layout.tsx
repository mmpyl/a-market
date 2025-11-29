import { RoleNav } from '@/components/dashboard/role-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
