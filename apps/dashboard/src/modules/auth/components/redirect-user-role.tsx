import NAV_LINKS from '@/app/constants/nav-links';
import { useAuthSession } from '@/modules/auth/hooks/use-auth-session';
import { USER_ROLE } from '@srms/api-contracts';
import { Navigate } from 'react-router';

export function RedirectUserRole() {
  const authSessionQuery = useAuthSession();

  if (!authSessionQuery.data?.success) {
    return <Navigate to="/login" replace />;
  }

  switch (authSessionQuery.data.data.user.role) {
    case USER_ROLE.ADMIN:
      return <Navigate to={NAV_LINKS.ADMIN.DASHBOARD.to} replace />;
    case USER_ROLE.CASHIER:
      return <Navigate to={NAV_LINKS.CASHIER.POS.to} replace />;
    case USER_ROLE.KITCHEN_STAFF:
      return <Navigate to={NAV_LINKS.KITCHEN.ORDERS.to} replace />;
  }
}
