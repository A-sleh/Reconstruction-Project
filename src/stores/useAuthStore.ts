import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

enum STORAGE_KEYS {
  accessToken = "access-token",
  refreshToken = "refresh-token",
  auth = "auth-storage",
}

export type ROLE = "Provider";
export interface User {
  firstName: string;
  lastName: string;
  photoURL: string;
  role: ROLE;
}

export interface AuthState {
  role: null | ROLE;
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  setAuth: (payload: { isAuthenticated: boolean; role: ROLE }) => void;
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
  const refreshTokenStr = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const refreshToken = refreshTokenStr ? JSON.parse(refreshTokenStr) : null;

  return refreshToken;
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      role: null,
      user: null,
      isAuthenticated: false,
      setAuth: ({ isAuthenticated, role }) => set({ isAuthenticated, role }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          role: null,
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
