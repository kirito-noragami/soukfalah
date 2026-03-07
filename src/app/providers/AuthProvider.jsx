/**
 * Auth — module-level singleton store.
 * useAuth() works from ANY component with zero Provider required.
 */
import { useCallback, useSyncExternalStore } from 'react';

// ─── Keys ────────────────────────────────────────────────────────────────────
const USERS_KEY   = 'soukfalah-users';
const SESSION_KEY = 'soukfalah-session';

// ─── Demo accounts ───────────────────────────────────────────────────────────
const DEMO = [
  { username: 'admin',  password: 'admin',  role: 'admin',  fullName: 'Admin User'  },
  { username: 'buyer',  password: 'buyer',  role: 'buyer',  fullName: 'Demo Buyer'  },
  { username: 'farmer', password: 'farmer', role: 'farmer', fullName: 'Demo Farmer' },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
const readUsers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const merged = [...DEMO];
    for (const u of stored) {
      if (!merged.find(d => d.username.toLowerCase() === u.username.toLowerCase()))
        merged.push(u);
    }
    return merged;
  } catch { return [...DEMO]; }
};

const writeUser = (user) => {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    localStorage.setItem(USERS_KEY, JSON.stringify([...stored, user]));
  } catch {}
};

const readSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};

const writeSession = (sess) => {
  try {
    if (sess) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      localStorage.setItem('soukfalah-role', sess.role);
      localStorage.setItem('soukfalah-user', sess.fullName);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('soukfalah-role');
      localStorage.removeItem('soukfalah-user');
    }
  } catch {}
};

// ─── Module store (lives outside React) ──────────────────────────────────────
let _session  = readSession();
const _subs   = new Set();
const _notify = () => _subs.forEach(fn => fn());

// useSyncExternalStore API
const _subscribe    = (cb) => { _subs.add(cb); return () => _subs.delete(cb); };
const _getSnap      = ()   => _session;
const _getServerSnap = ()  => null;

// ─── Auth actions (callable anywhere) ────────────────────────────────────────
export const authLogin = (username, password) => {
  if (!username || !password)
    return { ok: false, error: 'Please fill in both fields.' };

  const user = readUsers().find(
    u => u.username.toLowerCase() === username.toLowerCase().trim()
      && u.password === password.trim()
  );
  if (!user) return { ok: false, error: 'Wrong username or password.' };

  _session = { username: user.username, fullName: user.fullName, role: user.role };
  writeSession(_session);
  _notify();
  return { ok: true };
};

export const authRegister = (fullName, username, email, password, role) => {
  if (!fullName || !username || !email || !password || !role)
    return { ok: false, error: 'Please fill in every field.' };
  if (password.trim().length < 4)
    return { ok: false, error: 'Password must be at least 4 characters.' };

  const users = readUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()))
    return { ok: false, error: 'Username already taken. Please choose another.' };

  const newUser = {
    fullName: fullName.trim(),
    username: username.trim(),
    email:    email.trim(),
    password: password.trim(),
    role,
  };
  writeUser(newUser);
  _session = { username: newUser.username, fullName: newUser.fullName, role };
  writeSession(_session);
  _notify();
  return { ok: true };
};

export const authLogout = () => {
  _session = null;
  writeSession(null);
  _notify();
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const session = useSyncExternalStore(_subscribe, _getSnap, _getServerSnap);
  const login    = useCallback((u, p)              => authLogin(u, p),                []);
  const register = useCallback((fn, u, e, p, role) => authRegister(fn, u, e, p, role), []);
  const logout   = useCallback(()                  => authLogout(),                   []);
  return {
    session,
    isLoggedIn : !!session,
    role       : session?.role     ?? null,
    fullName   : session?.fullName ?? null,
    username   : session?.username ?? null,
    login,
    register,
    logout,
  };
};

// ─── Provider — passthrough, kept for compatibility with main.jsx ─────────────
const AuthProvider = ({ children }) => children;
export default AuthProvider;