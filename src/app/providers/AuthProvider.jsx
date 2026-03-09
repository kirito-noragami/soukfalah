/**
 * AuthProvider — 100% Supabase Auth.
 * After login, syncs role/fullName to localStorage so App.jsx + session.js
 * continue working without changes (getStoredRole, getStoredUser).
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const AuthContext = createContext(null);

// Sync to localStorage so existing session.js helpers still work everywhere
const syncSession = (profile, user) => {
  try {
    if (profile && user) {
      localStorage.setItem('soukfalah-role', profile.role || 'buyer');
      localStorage.setItem('soukfalah-user', profile.full_name || user.email || '');
    } else {
      localStorage.removeItem('soukfalah-role');
      localStorage.removeItem('soukfalah-user');
    }
  } catch {}
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(async (user) => {
    if (!user) { setProfile(null); syncSession(null, null); return null; }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    const p = data ?? null;
    setProfile(p);
    syncSession(p, user);
    return p;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      loadProfile(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
      loadProfile(sess?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const register = useCallback(async (fullName, _username, email, password, role) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message };

    const { error: profileError } = await supabase.from('profiles').upsert({
      id:        data.user.id,
      full_name: fullName,
      email,
      role:      role || 'buyer',
      status:    'active',
      verified:  false,
    });
    if (profileError) return { ok: false, error: profileError.message };

    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    syncSession(null, null);
  }, []);

  if (session === undefined) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--color-surface, #f8f9f4)',
        fontSize: '1rem', opacity: 0.5,
      }}>
        Loading…
      </div>
    );
  }

  const value = {
    session,
    profile,
    isLoggedIn: !!session,
    role:      profile?.role      ?? null,
    fullName:  profile?.full_name ?? session?.user?.email ?? null,
    username:  session?.user?.email ?? null,
    userId:    session?.user?.id   ?? null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export default AuthProvider;