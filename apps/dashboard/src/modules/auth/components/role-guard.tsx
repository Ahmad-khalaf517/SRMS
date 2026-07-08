import { useAuthSession } from '@/modules/auth/hooks/use-auth-session';
import type { UserRole } from '@srms/api-contracts';
import { Navigate, Outlet } from 'react-router';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const authSessionQuery = useAuthSession();

  if (!authSessionQuery.data?.success) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = allowedRoles.includes(authSessionQuery.data.data.user.role);

  if (!hasPermission) {
    return (
      <Navigate
        to="/403"
        state={{
          reason: 'missing_permission',
          from: window.location.pathname,
        }}
        replace
      />
    );
  }

  return children ?? <Outlet />;
}
