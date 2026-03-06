const KNOWN_ROLES = ['admin', 'buyer', 'farmer'];

export const getStoredRole = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawRole = window.localStorage.getItem('soukfalah-role');
  const role = rawRole ? rawRole.trim().toLowerCase() : '';
  return KNOWN_ROLES.includes(role) ? role : null;
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return (window.localStorage.getItem('soukfalah-user') || '').trim();
};

export const getRoleLabel = (role) => {
  if (role === 'admin') {
    return 'Admin';
  }

  if (role === 'farmer') {
    return 'Farmer';
  }

  if (role === 'buyer') {
    return 'Buyer';
  }

  return 'Guest';
};

