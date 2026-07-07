import { type AuthUser } from '@srms/types/auth';
import { create } from 'zustand';

type AuthSessionState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  // eslint-disable-next-line no-unused-vars
  setSession: (payload: { user: AuthUser; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setSession: ({ user, accessToken }) => set({ user, accessToken, isAuthenticated: true }),
  clearSession: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
