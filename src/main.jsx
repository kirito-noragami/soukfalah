import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './styles/theme.css';
import './styles/experience.css';
import './styles/dark-mode.css';
import App from './app/App';
import { applyLocale, getInitialLocale } from './app/i18n';
import { applyTheme, getInitialTheme } from './app/theme';

applyTheme(getInitialTheme());
applyLocale(getInitialLocale());

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<StrictMode>
      <App />
    </StrictMode>);
}
