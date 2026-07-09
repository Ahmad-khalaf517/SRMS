import { Route, Routes } from 'react-router';

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

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={[USER_ROLE.ADMIN]} />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
        <Route path="/categories" element={<CategoriesPage />} />
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
