import { Navigate, Outlet } from 'react-router';

import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
