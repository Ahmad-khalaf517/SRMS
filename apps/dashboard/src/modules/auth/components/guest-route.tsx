import { Navigate, Outlet } from 'react-router';
import { InitialLoader } from '@/app/components/initial-loader';
import { useAuthSession } from '@/modules/auth/hooks/use-auth-session';

export function GuestRoute() {
  const authSessionQuery = useAuthSession();
  if (authSessionQuery.isLoading) return <InitialLoader />;

  if (authSessionQuery.data?.success) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
