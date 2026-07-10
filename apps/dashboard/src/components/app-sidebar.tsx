'use client';

import * as React from 'react';
import { Utensils } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/ui/components/sidebar';
import { useAuthSession } from '@/modules/auth/hooks/use-auth-session';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuthSession();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Utensils className="size-5!" />
              <span className="text-base font-semibold">{auth.data?.data?.restaurant?.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
