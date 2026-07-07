import { Route, Routes } from 'react-router';

import DashboardPage from '@/modules/dashboard/pages/dashboard-page';
import LoginPage from '@/modules/auth/pages/login-page';
import ProtectedRoute from '@/modules/auth/components/protected-route';
import SignupPage from '@/modules/auth/pages/signup-page';
import NotFound from '@/pages/not-found';
import { useAuthSession } from '@/modules/auth/hooks/use-auth-session';
import { InitialLoader } from '@/app/components/initial-loader';

export default function AppRoutes() {
  const authSessionQuery = useAuthSession();
  if (authSessionQuery.isLoading) return <InitialLoader />;

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
