import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Role } from "@/types";
import type { Permission } from "@/lib/permissions";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

enum STORAGE_KEYS {
  accessToken = "access-token",
  refreshToken = "refresh-token",
  auth = "auth-storage",
}

export type { Role };
export type ROLE = Role;

export interface User {
  firstName: string;
  lastName: string;
  photoURL: string;
  role: Role;
}

export interface AuthState {
  role: null | Role;
  user: User | null;
  permissions: Permission[];
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  setAuth: (payload: { isAuthenticated: boolean; role: Role }) => void;
  can: (permission: Permission) => boolean;
  clearAuth: () => void;
  setUser: (user: User | null) => void;
}

export const getAuth = (): null | AuthState => {
  const authInfo = localStorage.getItem("access-token");
  const auth = authInfo ? JSON.parse(authInfo).state : null;

  return auth;
};

export const updateAccessToken = (newAccessToken: string) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    const newValue = { ...accessToken, state: { accessToken: newAccessToken } };
    localStorage.setItem(STORAGE_KEYS.accessToken, JSON.stringify(newValue));
  }
};
export const getAccessToken = () => {
  const accessTokenStr = localStorage.getItem(STORAGE_KEYS.accessToken);
  const accessToken = accessTokenStr ? JSON.parse(accessTokenStr) : null;

  return accessToken;
};

export const getRefreshToken = () => {
  const refreshTokenStr = sessionStorage.getItem(STORAGE_KEYS.refreshToken);
  const refreshToken = refreshTokenStr ? JSON.parse(refreshTokenStr) : null;

  return refreshToken;
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: "",
      refreshToken: "",
      role: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
      setAuth: ({ isAuthenticated, role }) => {
        const permissions = role ? (ROLE_PERMISSIONS[role] ?? []) : [];
        set({ isAuthenticated, role, permissions });
      },
      can: (permission: Permission) => {
        return get().permissions.includes(permission);
      },
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          role: null,
          permissions: [],
        }),
    }),
    {
      name: STORAGE_KEYS.auth, // localStorage key
    },
  ),
);

export const useAccessToken = create<{
  accessToken: string;
  setAccessToken: ({ accessToken }: { accessToken: string }) => void;
}>()(
  persist(
    (set) => ({
      accessToken: "",
      setAccessToken: ({ accessToken }) => set({ accessToken }),
    }),
    { name: STORAGE_KEYS.accessToken },
  ),
);

export const useRefreshToken = create<{
  refreshToken: string;
  setRefreshTokenToken: ({ refreshToken }: { refreshToken: string }) => void;
}>()(
  persist(
    (set) => ({
      refreshToken: "",
      setRefreshTokenToken: ({ refreshToken }) => set({ refreshToken }),
    }),
    {
      name: STORAGE_KEYS.refreshToken,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAuthStore;
