export const APP_NAVIGATE_EVENT = 'soukfalah:navigate';

const joinLocation = (url) => `${url.pathname}${url.search}${url.hash}`;

export const normalizePathname = (pathname) => pathname?.replace(/\/+$/, '') || '/';

export const navigateTo = (to, options = {}) => {
  if (typeof window === 'undefined' || !to) {
    return;
  }

  const { replace = false, state = null } = options;
  const nextUrl = new URL(to, window.location.href);
  const currentUrl = new URL(window.location.href);
  const nextLocation = joinLocation(nextUrl);
  const currentLocation = joinLocation(currentUrl);

  if (nextLocation === currentLocation) {
    // Preserve a smooth feel for hash links when navigating to the same location.
    if (nextUrl.hash) {
      const targetId = decodeURIComponent(nextUrl.hash.slice(1));
      const target = targetId ? document.getElementById(targetId) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  const historyMethod = replace ? 'replaceState' : 'pushState';
  window.history[historyMethod](state, '', nextLocation);
  window.dispatchEvent(new CustomEvent(APP_NAVIGATE_EVENT));
};

export const isInternalNavigationLink = (anchor) => {
  if (!anchor) {
    return false;
  }

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return false;
  }

  if (anchor.target && anchor.target !== '_self') {
    return false;
  }

  if (anchor.hasAttribute('download')) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
};
