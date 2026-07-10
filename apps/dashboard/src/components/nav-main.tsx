'use client';
import { useNavigate } from 'react-router';
import { USER_ROLE } from '@srms/api-contracts';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/ui/components/sidebar';
import NAV_LINKS from '@/app/constants/nav-links';
import { useMemo } from 'react';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

const activeItemClassName = 'bg-primary text-primary-foreground';

export function NavMain() {
  const navigate = useNavigate();
  const user = useAuthSessionStore((state) => state.user);
  const activePath = window.location.pathname;

  const navItems = useMemo(() => {
    const role = user?.role;

    if (role === USER_ROLE.CASHIER) {
      return Object.values(NAV_LINKS.CASHIER);
    }

    if (role === USER_ROLE.KITCHEN_STAFF) {
      return Object.values(NAV_LINKS.KITCHEN);
    }

    return Object.values(NAV_LINKS.ADMIN);
  }, [user?.role]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => navigate(item.to)}
                tooltip={item.title}
                className={activePath === item.to ? activeItemClassName : ''}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
