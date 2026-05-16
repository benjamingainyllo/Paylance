import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col lg:flex-row bg-background overflow-hidden">
        <MobileHeader />
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </AuthGuard>
  );
}
