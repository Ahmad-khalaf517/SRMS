import { Navigate, Route, Routes } from 'react-router';

import DashboardPage from '@/modules/dashboard/pages/dashboard-page';
import LoginPage from '@/modules/auth/pages/login-page';
import ProtectedRoute from '@/modules/auth/components/protected-route';
import SignupPage from '@/modules/auth/pages/signup-page';
import NotFound from '@/pages/not-found';
import { GuestRoute } from '@/modules/auth/components/guest-route';
import ForbiddenPage from '@/pages/forbidden';
import { RoleGuard } from '@/modules/auth/components/role-guard';
import { USER_ROLE } from '@srms/api-contracts';
import CategoriesPage from '@/modules/categories/pages/categories-page';
import AuthLayout from '@/layouts/AuthLayout';
import NAV_LINKS from '@/app/constants/nav-links';
import KitchenSectionsPage from '@/modules/kitchen-section/pages/kitchen-section-page';
import MenuItemsPage from '@/modules/menu-item/pages/menu-items-page';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={[USER_ROLE.ADMIN]} />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to={NAV_LINKS.ADMIN.DASHBOARD.to} replace />} />
            <Route path={NAV_LINKS.ADMIN.DASHBOARD.to} element={<DashboardPage />} />
            <Route path={NAV_LINKS.ADMIN.CATEGORIES.to} element={<CategoriesPage />} />
            <Route path={NAV_LINKS.ADMIN.KITCHEN.to} element={<KitchenSectionsPage />} />
            <Route path={NAV_LINKS.ADMIN.MENU_ITEMS.to} element={<MenuItemsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="/403" element={<ForbiddenPage />} />
      </Route>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
