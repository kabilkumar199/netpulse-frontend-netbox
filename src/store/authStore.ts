/**
 * Zustand Store for Authentication
 * Replaces Redux authSlice
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setCredentials: (credentials: { user: User; token: string; refreshToken?: string }) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// Get initial state from localStorage
const getInitialState = (): AuthState => {
  const storedToken = localStorage.getItem('authToken');
  const storedRefresh = localStorage.getItem('refreshToken');
  const storedUser = localStorage.getItem('user');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    refreshToken: storedRefresh,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setCredentials: (credentials) => {
        localStorage.setItem('authToken', credentials.token);
        if (credentials.refreshToken) {
          localStorage.setItem('refreshToken', credentials.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(credentials.user));

        set({
          user: credentials.user,
          token: credentials.token,
          refreshToken: credentials.refreshToken || null,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

