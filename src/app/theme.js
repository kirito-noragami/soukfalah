export const THEME_STORAGE_KEY = 'soukfalah-theme';
export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const isValidTheme = (value) => value === LIGHT_THEME || value === DARK_THEME;

export const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(value) ? value : null;
  } catch {
    return null;
  }
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return LIGHT_THEME;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
};

export const getInitialTheme = () => getStoredTheme() || getSystemTheme();

export const applyTheme = (theme) => {
  if (typeof document === 'undefined' || !isValidTheme(theme)) {
    return;
  }

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
};

export const persistTheme = (theme) => {
  if (typeof window === 'undefined' || !isValidTheme(theme)) {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (private mode / blocked storage).
  }
};

export const toggleThemeValue = (theme) => theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
