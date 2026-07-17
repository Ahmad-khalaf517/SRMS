import { GalleryVerticalEnd } from 'lucide-react';
import LoginForm from '@/modules/auth/components/login-form';
import { useEffect } from 'react';
import loginImage from '@/assets/login.jpeg';
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

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SRMS Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <img
          src={loginImage}
          alt="SRMS restaurant"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <svg
          viewBox="0 0 220 1000"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 z-10 h-full w-[200px]"
        >
          <path
            d="
        M 0 0
        H 100
        C 190 120, 190 300, 105 410
        C 20 520, 20 700, 110 820
        C 175 910, 165 970, 100 1000
        H 0
        Z
      "
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
