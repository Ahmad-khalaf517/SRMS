import SignupTemplate from '../../../templates/signup/page';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export default function SignupPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <SignupTemplate />;
}
