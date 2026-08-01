import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import {
  getSupabaseUser,
  mapSupabaseUser,
  refreshSupabaseSession,
  signInWithPassword,
  signOutSupabase,
  type SupabaseSession,
} from '@/api/supabaseAuth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAccessToken: (accessToken: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const AUTH_USER_KEY = 'auth_user';

function normalizeUser(user: User): User {
  const displayName = user.displayName || user.display_name || user.name || user.email;

  return {
    ...user,
    name: displayName,
    displayName,
    role: user.role || 'User',
  };
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function readUrlAuthParams() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const queryParams = new URLSearchParams(window.location.search);

  return {
    accessToken: hashParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token'),
    error:
      hashParams.get('error_description') ||
      queryParams.get('error_description') ||
      hashParams.get('error') ||
      queryParams.get('error'),
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback(async (session: SupabaseSession) => {
    if (!session.access_token) {
      throw new Error('Supabase tidak mengirim access token.');
    }

    const supabaseUser = session.user || (await getSupabaseUser(session.access_token));
    const authenticatedUser = normalizeUser(mapSupabaseUser(supabaseUser));

    localStorage.setItem(AUTH_TOKEN_KEY, session.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));

    if (session.refresh_token) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refresh_token);
    }

    setToken(session.access_token);
    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const urlAuth = readUrlAuthParams();

      if (urlAuth.error) {
        window.history.replaceState(null, document.title, window.location.pathname);
        clearAuthState();
        setIsLoading(false);
        return;
      }

      if (urlAuth.accessToken) {
        try {
          window.history.replaceState(null, document.title, window.location.pathname);
          await saveSession({
            access_token: urlAuth.accessToken,
            refresh_token: urlAuth.refreshToken || undefined,
          });
        } catch {
          clearAuthState();
        } finally {
          setIsLoading(false);
        }
        return;
      }

      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!storedToken || !storedUser) {
        clearAuthState();
        setIsLoading(false);
        return;
      }

      try {
        await getSupabaseUser(storedToken);
        setToken(storedToken);
        setUser(normalizeUser(JSON.parse(storedUser) as User));
      } catch {
        if (!storedRefreshToken) {
          clearAuthState();
          setIsLoading(false);
          return;
        }

        try {
          const refreshedSession = await refreshSupabaseSession(storedRefreshToken);
          await saveSession(refreshedSession);
        } catch {
          clearAuthState();
        }
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [clearAuthState, saveSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);

      try {
        const session = await signInWithPassword(email, password);
        await saveSession(session);
      } catch (error) {
        clearAuthState();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [clearAuthState, saveSession]
  );

  const loginWithAccessToken = useCallback(
    async (accessToken: string) => {
      setIsLoading(true);

      try {
        return await saveSession({ access_token: accessToken });
      } catch (error) {
        clearAuthState();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [clearAuthState, saveSession]
  );

  const logout = useCallback(async () => {
    const activeToken = token;

    clearAuthState();

    if (activeToken) {
      try {
        await signOutSupabase(activeToken);
      } catch {
        // Local logout should still succeed even if the remote session is already invalid.
      }
    }
  }, [clearAuthState, token]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = normalizeUser({ ...currentUser, ...updates });
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });
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
      updateUser,
    }),
    [user, token, isAuthenticated, isLoading, login, loginWithAccessToken, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
