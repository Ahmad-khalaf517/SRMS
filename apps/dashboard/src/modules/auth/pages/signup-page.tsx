import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SignupForm } from '@/modules/auth/components/signup-form';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export default function SignupPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-6xl">
        <SignupForm />
      </div>
    </div>
  );
}
