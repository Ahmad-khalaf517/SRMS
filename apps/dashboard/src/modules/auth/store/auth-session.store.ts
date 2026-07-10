import type { User } from '@srms/api-contracts';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type AuthSessionState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (payload: { user: User; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setSession: ({ user, accessToken }) =>
        set({ user, accessToken, isAuthenticated: true }, false, 'setSession'),
      clearSession: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }, false, 'clearSession'),
    }),
    { name: 'auth-session-store' },
  ),
);
