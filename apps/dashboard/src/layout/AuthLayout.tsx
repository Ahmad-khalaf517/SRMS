import { AppSidebar } from '@/modules/dashboard/components/app-sidebar';
import { SiteHeader } from '@/modules/dashboard/components/site-header';
import { SidebarInset, SidebarProvider } from '@srms/ui/components/sidebar';
import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="mt-0!">
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
