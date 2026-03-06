export const adminNavItems = [{
  key: 'dashboard',
  label: 'Dashboard'
}, {
  key: 'users',
  label: 'User Management'
}, {
  key: 'validation',
  label: 'Product Validation'
}, {
  key: 'stats',
  label: 'Platform Stats'
}, {
  key: 'settings',
  label: 'Settings'
}];

export const adminRoleOptions = ['Farmer', 'Buyer', 'Business', 'Admin'];
export const adminStatusOptions = ['Active', 'Suspended', 'Pending'];
export const adminLanguageCycle = ['AR', 'FR', 'EN'];

export const initialAdminUsers = [{
  id: 'U-901',
  name: 'Hamid Merabet',
  email: 'hamid.merabet@soukfellah.com',
  role: 'Farmer',
  listings: 8,
  initials: 'HM',
  status: 'Active',
  verified: true,
  joinedAt: '2026-01-10T10:10:00Z'
}, {
  id: 'U-902',
  name: 'Zineb Bekkali',
  email: 'zineb.bekkali@soukfellah.com',
  role: 'Buyer',
  listings: 15,
  initials: 'ZB',
  status: 'Active',
  verified: true,
  joinedAt: '2026-01-12T09:00:00Z'
}, {
  id: 'U-903',
  name: 'Ali Rachid',
  email: 'ali.rachid@soukfellah.com',
  role: 'Business',
  listings: 5,
  initials: 'AR',
  status: 'Pending',
  verified: false,
  joinedAt: '2026-01-20T13:45:00Z'
}, {
  id: 'U-904',
  name: 'Laila Amari',
  email: 'laila.amari@soukfellah.com',
  role: 'Farmer',
  listings: 12,
  initials: 'LA',
  status: 'Active',
  verified: true,
  joinedAt: '2026-01-22T08:20:00Z'
}, {
  id: 'U-905',
  name: 'Karim Othmani',
  email: 'karim.othmani@soukfellah.com',
  role: 'Buyer',
  listings: 10,
  initials: 'KO',
  status: 'Suspended',
  verified: true,
  joinedAt: '2026-01-24T11:05:00Z'
}];

export const initialAdminValidations = [{
  id: 'VAL-121',
  name: 'Organic Carrots',
  farmer: 'Fatima Idrissi',
  location: 'Rabat',
  quantityKg: 180,
  pricePerKg: 9,
  category: 'Vegetables',
  riskScore: 'Low',
  status: 'Pending',
  note: 'New batch with updated harvest date.',
  submittedAt: '2026-02-21T10:05:00Z'
}, {
  id: 'VAL-122',
  name: 'Summer Melons',
  farmer: 'Youssef Mertani',
  location: 'Agadir',
  quantityKg: 240,
  pricePerKg: 12,
  category: 'Fruits',
  riskScore: 'Medium',
  status: 'Pending',
  note: 'Bulk listing for B2B customers.',
  submittedAt: '2026-02-21T08:40:00Z'
}, {
  id: 'VAL-123',
  name: 'Red Bell Peppers',
  farmer: 'Karim El Hanafi',
  location: 'Chefchaouen',
  quantityKg: 95,
  pricePerKg: 18,
  category: 'Vegetables',
  riskScore: 'Low',
  status: 'Changes Requested',
  note: 'Need clearer product photos.',
  submittedAt: '2026-02-20T16:10:00Z'
}];

export const initialAdminAudit = [{
  id: 'admin-audit-1',
  text: 'Daily moderation review started.',
  type: 'info',
  createdAt: '2026-02-22T08:00:00Z'
}, {
  id: 'admin-audit-2',
  text: 'Suspended account Karim Othmani for duplicate orders investigation.',
  type: 'danger',
  createdAt: '2026-02-21T15:40:00Z'
}, {
  id: 'admin-audit-3',
  text: 'Approved payout batch #PB-2202.',
  type: 'success',
  createdAt: '2026-02-21T12:15:00Z'
}];

export const adminChartDataByRange = {
  weekly: [{
    label: 'Mon',
    value: 84
  }, {
    label: 'Tue',
    value: 91
  }, {
    label: 'Wed',
    value: 76
  }, {
    label: 'Thu',
    value: 105
  }, {
    label: 'Fri',
    value: 112
  }, {
    label: 'Sat',
    value: 98
  }, {
    label: 'Sun',
    value: 87
  }],
  monthly: [{
    label: 'W1',
    value: 320
  }, {
    label: 'W2',
    value: 410
  }, {
    label: 'W3',
    value: 375
  }, {
    label: 'W4',
    value: 465
  }],
  quarterly: [{
    label: 'Q1',
    value: 1180
  }, {
    label: 'Q2',
    value: 1420
  }, {
    label: 'Q3',
    value: 1365
  }, {
    label: 'Q4',
    value: 1590
  }]
};
