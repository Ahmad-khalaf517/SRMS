import { ChefHat, LayoutDashboard, LayoutList, Shapes, Users } from 'lucide-react';
// Admin navigation links
const ADMIN_NAV_LINKS = {
  DASHBOARD: {
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  CATEGORIES: {
    title: 'Categories',
    to: '/categories',
    icon: Shapes,
  },
  USERS: {
    title: 'Users',
    to: '/users',
    icon: Users,
  },
  KITCHEN: {
    title: 'Kitchen',
    to: '/kitchen',
    icon: ChefHat,
  },
  MENU_ITEMS: {
    title: 'Menu items',
    to: '/menu-items',
    icon: LayoutList,
  },
};

const NAV_LINKS = {
  ADMIN: ADMIN_NAV_LINKS,
};

export default NAV_LINKS;
