import AuthGuard from '@/components/admin/AuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — Dragon Menu' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 md:p-8 pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
