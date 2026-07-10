'use client';
import { useNavigate } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/ui/components/sidebar';
import NAV_LINKS from '@/app/constants/nav-links';
import { useMemo } from 'react';

const activeItemClassName = 'bg-primary text-primary-foreground';

export function NavMain() {
  const navigate = useNavigate();
  const activePath = window.location.pathname;

  const navItems = useMemo(() => Object.values(NAV_LINKS.ADMIN), []);

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
