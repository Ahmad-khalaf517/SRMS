'use client';
import { useNavigate } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/ui/components/sidebar';
import { ChefHat, LayoutDashboard, LayoutList, Shapes, Users } from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Categories',
    to: '/categories',
    icon: Shapes,
  },
  {
    title: 'Users',
    to: '/users',
    icon: Users,
  },
  {
    title: 'Kitchen',
    to: '/kitchen',
    icon: ChefHat,
  },
  {
    title: 'Menu items',
    to: '/menu-items',
    icon: LayoutList,
  },
];

export function NavMain() {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton onClick={() => navigate(item.to)} tooltip={item.title}>
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
