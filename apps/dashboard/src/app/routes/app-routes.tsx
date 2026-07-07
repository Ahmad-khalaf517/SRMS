import { Route, Routes } from 'react-router';

import DashboardPage from '@/modules/dashboard/pages/dashboard-page';
import LoginPage from '@/modules/auth/pages/login-page';
import SignupPage from '@/modules/auth/pages/signup-page';
import NotFound from '@/pages/not-found';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
