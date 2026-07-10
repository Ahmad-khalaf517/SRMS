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
  ORDERS: {
    title: 'Orders',
    to: '/orders',
    icon: LayoutList,
  },
};

const CASHIER_NAV_LINKS = {
  POS: {
    title: 'POS',
    to: '/pos',
    icon: LayoutList,
  },
  MY_ORDERS: {
    title: 'My Orders',
    to: '/my-orders',
    icon: LayoutDashboard,
  },
};

const KITCHEN_NAV_LINKS = {
  ORDERS: {
    title: 'Kitchen Orders',
    to: '/kitchen/orders',
    icon: ChefHat,
  },
};

const NAV_LINKS = {
  ADMIN: ADMIN_NAV_LINKS,
  CASHIER: CASHIER_NAV_LINKS,
  KITCHEN: KITCHEN_NAV_LINKS,
};

export default NAV_LINKS;
