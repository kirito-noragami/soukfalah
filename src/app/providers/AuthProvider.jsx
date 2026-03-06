import { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) return { session: null, isLoggedIn: false, role: null, username: null, login: () => {}, logout: () => {} };
  return ctx;
};

const KNOWN_ROLES = ['admin', 'buyer', 'farmer'];

const loadSession = () => {
  try {
    const role = localStorage.getItem('soukfalah-role') ?? '';
    const user = localStorage.getItem('soukfalah-user') ?? '';
    const normalRole = role.trim().toLowerCase();
    if (KNOWN_ROLES.includes(normalRole) && user) return { username: user, role: normalRole };
  } catch {}
  return null;
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(loadSession);

  const login = useCallback((username, role) => {
    try {
      localStorage.setItem('soukfalah-role', role);
      localStorage.setItem('soukfalah-user', username);
    } catch {}
    setSession({ username, role });
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('soukfalah-role');
      localStorage.removeItem('soukfalah-user');
    } catch {}
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoggedIn: !!session, role: session?.role ?? null, username: session?.username ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;