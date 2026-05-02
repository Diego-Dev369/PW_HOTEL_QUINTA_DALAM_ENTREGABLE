import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, getStoredUser, loginUser, registerUser, clearSession } from '../services/authService';
import { TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('qd:auth-expired', handleExpired);
    return () => window.removeEventListener('qd:auth-expired', handleExpired);
  }, []);

  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }

    if (user) {
      setInitializing(false);
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, [token, user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const auth = await loginUser(credentials);
      setToken(auth.accessToken);
      const profile = await fetchCurrentUser();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const auth = await registerUser(payload);
      setToken(auth.accessToken);
      const profile = await fetchCurrentUser();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!token) return null;
    const profile = await fetchCurrentUser();
    setUser(profile);
    return profile;
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initializing,
      isAuthenticated: Boolean(token),
      register,
      login,
      logout,
      refreshUser
    }),
    [user, token, loading, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
