import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import apiClient from '@/api/client';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAccessToken: (accessToken: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const queryParams = new URLSearchParams(window.location.search);
      const oauthError = hashParams.get('error_description') || queryParams.get('error_description');
      const accessToken = hashParams.get('access_token');

      if (oauthError) {
        window.history.replaceState(null, document.title, window.location.pathname);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setIsLoading(false);
        return;
      }

      if (accessToken) {
        try {
          window.history.replaceState(null, document.title, window.location.pathname);
          localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

          const { data } = await apiClient.get<{ success: boolean; user: User }>('/me');

          if (!data.success || !data.user) {
            throw new Error('Unable to verify Supabase session');
          }

          const authenticatedUser: User = {
            ...data.user,
            name: data.user.name || data.user.email,
            role: data.user.role || 'User',
          };

          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
          setToken(accessToken);
          setUser(authenticatedUser);
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Check for existing session on mount
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }

      setIsLoading(false);
    };

    void initializeAuth();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login - in real app, this would call the API
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        id: '1',
        email,
        name: 'John Charly',
        avatar: undefined,
        role: 'Super Admin',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithAccessToken = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

      const { data } = await apiClient.get<{ success: boolean; user: User }>('/me');

      if (!data.success || !data.user) {
        throw new Error('Unable to verify Supabase session');
      }

      const authenticatedUser: User = {
        ...data.user,
        name: data.user.name || data.user.email,
        role: data.user.role || 'User',
      };

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
      setToken(accessToken);
      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      loginWithAccessToken,
      logout,
    }),
    [user, token, isAuthenticated, isLoading, login, loginWithAccessToken, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
