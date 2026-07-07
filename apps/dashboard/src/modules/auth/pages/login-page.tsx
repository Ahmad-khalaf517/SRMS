import LoginTemplate from '../../../templates/login/page';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <LoginTemplate />;
}
