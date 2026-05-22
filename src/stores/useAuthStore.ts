import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  setAuth: (payload: { token: string | null; role?: string | null; user?: UserProfile | null }) => void;
  clearAuth: () => void;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,
      user: null,
      setAuth: ({ token, role = null, user = null }) =>
        set({ token, role, user, isAuthenticated: !!token }),
      clearAuth: () => set({ token: null, role: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (s) => ({ token: s.token, role: s.role, user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useAuthStore;
