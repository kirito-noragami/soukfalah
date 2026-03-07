import { useDeferredValue, useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage from '../../../assets/images/home-hero.png';
import { navigateTo } from '../../../app/navigation';
import {
  adminChartDataByRange,
  adminLanguageCycle,
  adminNavItems,
  adminRoleOptions,
  adminStatusOptions,
  initialAdminAudit,
  initialAdminUsers,
  initialAdminValidations
} from './adminDashboardData';
import '../dashboard-ui.css';
import './AdminDashboardPage.css';

let auditCounter = 10;
let userCounter = 905;

const formatDh = value => `${new Intl.NumberFormat('fr-MA').format(Math.round(value))} DH`;
const formatStamp = iso => new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(iso));
const nextUserId = () => `U-${String(++userCounter).padStart(3, '0')}`;
const statusBadge = status => {
  if (status === 'Active' || status === 'Approved') return 'dash-status dash-status--success';
  if (status === 'Suspended' || status === 'Rejected') return 'dash-status dash-status--danger';
  if (status === 'Pending' || status === 'Changes Requested') return 'dash-status dash-status--warning';
  return 'dash-status dash-status--info';
};

const AdminDashboardPage = () => {
  const { fullName, username } = useAuth();
  const displayName = fullName || username || 'Admin';
  const initials = displayName.split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('') || 'AD';
  const pageStyle = {
    '--admin-hero-image': `url(${heroImage})`,
    '--admin-fields-image': `url(${fieldsImage})`
  };

  const [activeSection, setActiveSection] = useState('dashboard');
  const [language, setLanguage] = useState('EN');
  const [users, setUsers] = useState(initialAdminUsers);
  const [validations, setValidations] = useState(initialAdminValidations);
  const [auditLog, setAuditLog] = useState(initialAdminAudit);
  const [notice, setNotice] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(initialAdminUsers[0]?.email || null);
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [userDraft, setUserDraft] = useState({
    name: '',
    email: '',
    role: 'Buyer',
    listings: '0',
    status: 'Active'
  });
  const [selectedValidationId, setSelectedValidationId] = useState(initialAdminValidations[0]?.id || null);
  const [showResolvedValidations, setShowResolvedValidations] = useState(true);
  const [reviewComment, setReviewComment] = useState('');
  const [reportRange, setReportRange] = useState('weekly');
  const [settingsState, setSettingsState] = useState({
    maintenanceMode: false,
    autoApproveTrustedFarmers: false,
    emailModerationAlerts: true,
    maxDailyListings: 25,
    platformFeePercent: 6
  });

  const deferredUserSearch = useDeferredValue(userSearch);

  const pushNotice = (message, type = 'success') => setNotice({
    id: Date.now(),
    message,
    type
  });

  const pushAudit = (text, type = 'info') => setAuditLog(current => [{
    id: `admin-audit-${++auditCounter}`,
    text,
    type,
    createdAt: new Date().toISOString()
  }, ...current].slice(0, 12));

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (userStatusFilter !== 'all' && user.status !== userStatusFilter) return false;
    if (!deferredUserSearch.trim()) return true;
    const q = deferredUserSearch.trim().toLowerCase();
    return `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(q);
  });

  const displayedUsers = showAllUsers ? filteredUsers : filteredUsers.slice(0, 6);
  const selectedUser = users.find(user => user.email === selectedUserEmail) || displayedUsers[0] || users[0] || null;
  const visibleValidations = validations.filter(item => showResolvedValidations || item.status === 'Pending');
  const selectedValidation = validations.find(item => item.id === selectedValidationId) || visibleValidations[0] || validations[0] || null;
  const chartSeries = adminChartDataByRange[reportRange];
  const maxChartValue = Math.max(...chartSeries.map(item => item.value), 1);

  const totalListings = users.reduce((sum, user) => sum + user.listings, 0);
  const pendingValidationCount = validations.filter(item => item.status === 'Pending').length;
  const approvedValidationCount = validations.filter(item => item.status === 'Approved').length;
  const estimatedRevenueDh = users.reduce((sum, user) => sum + user.listings * 210, 0);
  const chartTotal = chartSeries.reduce((sum, item) => sum + item.value, 0);

  const openUserEditor = user => {
    setSelectedUserEmail(user.email);
    setUserDraft({
      name: user.name,
      email: user.email,
      role: user.role,
      listings: String(user.listings),
      status: user.status
    });
    setShowUserEditor(true);
    setActiveSection('users');
  };

  const saveUser = () => {
    const name = userDraft.name.trim();
    const email = userDraft.email.trim().toLowerCase();
    if (!name || !email.includes('@')) {
      pushNotice('Please enter a valid name and email.', 'warning');
      return;
    }
    const listings = Math.max(0, Number.parseInt(userDraft.listings, 10) || 0);
    const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'NU';
    const existing = users.find(user => user.email === email);
    if (existing) {
      setUsers(current => current.map(user => user.email === email ? {
        ...user,
        name,
        role: userDraft.role,
        listings,
        status: userDraft.status,
        initials
      } : user));
      pushAudit(`Updated user ${email}`, 'info');
      pushNotice('User updated successfully.', 'success');
    } else {
      const newUser = {
        id: nextUserId(),
        name,
        email,
        role: userDraft.role,
        listings,
        initials,
        status: userDraft.status,
        verified: false,
        joinedAt: new Date().toISOString()
      };
      setUsers(current => [newUser, ...current]);
      setSelectedUserEmail(newUser.email);
      pushAudit(`Created user ${email}`, 'success');
      pushNotice('New user created.', 'success');
    }
    setShowUserEditor(false);
  };

  const deleteUser = user => {
    setUsers(current => current.filter(item => item.email !== user.email));
    if (selectedUserEmail === user.email) setSelectedUserEmail(null);
    pushAudit(`Deleted user ${user.email}`, 'danger');
    pushNotice(`${user.name} deleted.`, 'danger');
  };

  const toggleUserStatus = user => {
    const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers(current => current.map(item => item.email === user.email ? {
      ...item,
      status: nextStatus
    } : item));
    pushAudit(`${nextStatus === 'Suspended' ? 'Suspended' : 'Reactivated'} ${user.email}`, nextStatus === 'Suspended' ? 'danger' : 'success');
    pushNotice(`${user.name} is now ${nextStatus}.`, nextStatus === 'Suspended' ? 'danger' : 'success');
  };

  const reviewValidation = status => {
    if (!selectedValidation) return;
    setValidations(current => current.map(item => item.id === selectedValidation.id ? {
      ...item,
      status,
      note: reviewComment.trim() || item.note
    } : item));
    pushAudit(`${status} ${selectedValidation.id}`, status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning');
    pushNotice(`${selectedValidation.name} marked as ${status}.`, status === 'Rejected' ? 'danger' : status === 'Approved' ? 'success' : 'warning');
    setReviewComment('');
  };

  const cycleLanguage = () => {
    const currentIndex = adminLanguageCycle.indexOf(language);
    const next = adminLanguageCycle[(currentIndex + 1) % adminLanguageCycle.length];
    setLanguage(next);
    pushAudit(`Language changed to ${next}`, 'info');
  };

  const toggleSetting = key => {
    setSettingsState(current => ({
      ...current,
      [key]: !current[key]
    }));
    pushAudit(`Toggled setting ${key}`, 'info');
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('soukfalah-role');
      window.localStorage.removeItem('soukfalah-user');
    }
    navigateTo('/');
  };

  return <div className="admin-dashboard" style={pageStyle}>
      <div className="admin-dashboard__layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__profile">
            <div className="admin-sidebar__avatar" aria-hidden="true"><span>{initials}</span></div>
            <div>
              <p className="admin-sidebar__name">{displayName}</p>
              <p className="admin-sidebar__role">Administrator</p>
            </div>
          </div>

          <nav className="admin-sidebar__nav" aria-label="Admin navigation">
            {adminNavItems.map(item => <button key={item.key} className={activeSection === item.key ? 'active' : undefined} type="button" onClick={() => setActiveSection(item.key)}>
                <span className="admin-nav__icon" aria-hidden="true" />
                {item.label}
              </button>)}
          </nav>

          <div className="admin-sidebar__footer">
            <button type="button" onClick={() => setActiveSection('settings')}>
              <span className="admin-nav__icon" aria-hidden="true" />
              Settings
            </button>
            <button type="button" onClick={logout}>
              <span className="admin-nav__icon" aria-hidden="true" />
              Log Out
            </button>
            <div className="admin-sidebar__langs" role="group" aria-label="Language selector">
              {adminLanguageCycle.map(code => <button key={code} className={language === code ? 'active' : undefined} type="button" onClick={() => setLanguage(code)}>
                  {code}
                </button>)}
            </div>
          </div>
        </aside>

        <div className="admin-dashboard__content">
          <header className="admin-welcome">
            <div>
              <p className="admin-welcome__kicker">Administrator Dashboard</p>
              <h1>Welcome back, {displayName}!</h1>
              <p>Moderate listings, manage users, and monitor platform health with live controls.</p>
            </div>
            <div className="admin-welcome__actions">
              <span className="admin-chip">Admin</span>
              <button type="button" className="admin-language" onClick={cycleLanguage}>
                {language}
                <span aria-hidden="true">v</span>
              </button>
            </div>
          </header>

          {notice ? <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
              <span>{notice.message}</span>
              <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>Dismiss</button>
            </div> : null}

          <section className="admin-stats">
            <article><div className="admin-stats__icon">U</div><div><h3>{users.length}</h3><p>Users</p><span>{filteredUsers.length} filtered</span></div></article>
            <article><div className="admin-stats__icon">P</div><div><h3>{totalListings}</h3><p>Listings</p><span>{pendingValidationCount} pending review</span></div></article>
            <article><div className="admin-stats__icon">R</div><div><h3>{formatDh(estimatedRevenueDh)}</h3><p>Est. Revenue</p><span>{approvedValidationCount} approved</span></div></article>
          </section>

          {(activeSection === 'dashboard' || activeSection === 'users') ? <section className="admin-users">
              <div className="admin-section__header admin-section__header--stack">
                <div>
                  <h2>User Management</h2>
                  <div className="dash-toolbar__meta">Search, filter and manage account lifecycle.</div>
                </div>
                <div className="admin-users__tools">
                  <div className="admin-search">
                    <span className="admin-search__icon" aria-hidden="true" />
                    <input type="search" placeholder="Search users..." value={userSearch} onChange={event => setUserSearch(event.target.value)} />
                  </div>
                  <select className="dash-select" value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                    <option value="all">All roles</option>
                    {adminRoleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                  <select className="dash-select" value={userStatusFilter} onChange={event => setUserStatusFilter(event.target.value)}>
                    <option value="all">All statuses</option>
                    {adminStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button type="button" className="dash-btn dash-btn--primary" onClick={() => {
                setUserDraft({
                  name: '',
                  email: '',
                  role: 'Buyer',
                  listings: '0',
                  status: 'Active'
                });
                setShowUserEditor(true);
                setActiveSection('users');
              }}>Add User</button>
                </div>
              </div>

              <div className="admin-table">
                <div className="admin-table__head">
                  <span>User</span>
                  <span>Role</span>
                  <span>Listings</span>
                  <span>Actions</span>
                </div>
                {displayedUsers.length ? displayedUsers.map(user => <div className={`admin-table__row${selectedUserEmail === user.email ? ' is-selected' : ''}`} key={user.email}>
                      <div className="admin-user">
                        <span className="admin-user__avatar" aria-hidden="true">{user.initials}</span>
                        <div>
                          <p className="admin-user__name">{user.name}</p>
                          <p className="admin-user__email">{user.email}</p>
                          <div className="admin-user__meta">
                            <span className={statusBadge(user.status)}>{user.status}</span>
                            <span className="dash-toolbar__meta">{user.verified ? 'Verified' : 'Unverified'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="admin-pill">{user.role}</span>
                      <span className="admin-pill">{user.listings}</span>
                      <div className="admin-actions">
                        <button className="primary" type="button" onClick={() => openUserEditor(user)}>Manage</button>
                        <button className="ghost" type="button" onClick={() => toggleUserStatus(user)}>
                          {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                        </button>
                        <button className="dash-btn dash-btn--danger dash-btn--compact" type="button" onClick={() => deleteUser(user)}>Delete</button>
                      </div>
                    </div>) : <div className="dash-empty admin-users__empty">No users match the filters.</div>}
              </div>

              <div className="admin-users__footer">
                <button className="admin-view" type="button" onClick={() => setShowAllUsers(value => !value)}>
                  {showAllUsers ? 'Show Recent' : 'View All'}
                </button>
              </div>

              {showUserEditor ? <div className="dash-section admin-users__editor">
                  <div className="dash-toolbar">
                    <div>
                      <p className="dash-section__title">{users.some(user => user.email === userDraft.email.trim().toLowerCase()) ? 'Edit User' : 'Create User'}</p>
                      <p className="dash-section__subtitle">Update profile, role, listings and status.</p>
                    </div>
                    <button type="button" className="dash-btn" onClick={() => setShowUserEditor(false)}>Close</button>
                  </div>
                  <div className="dash-field-grid dash-field-grid--3">
                    <label className="dash-label">Name<input className="dash-input" value={userDraft.name} onChange={event => setUserDraft(current => ({ ...current, name: event.target.value }))} /></label>
                    <label className="dash-label">Email<input className="dash-input" value={userDraft.email} onChange={event => setUserDraft(current => ({ ...current, email: event.target.value }))} /></label>
                    <label className="dash-label">Role<select className="dash-select" value={userDraft.role} onChange={event => setUserDraft(current => ({ ...current, role: event.target.value }))}>{adminRoleOptions.map(role => <option key={role} value={role}>{role}</option>)}</select></label>
                    <label className="dash-label">Listings<input className="dash-input" type="number" min="0" value={userDraft.listings} onChange={event => setUserDraft(current => ({ ...current, listings: event.target.value }))} /></label>
                    <label className="dash-label">Status<select className="dash-select" value={userDraft.status} onChange={event => setUserDraft(current => ({ ...current, status: event.target.value }))}>{adminStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}</select></label>
                  </div>
                  <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--primary" onClick={saveUser}>Save User</button>
                    {selectedUser ? <button type="button" className="dash-btn dash-btn--soft" onClick={() => toggleUserStatus(selectedUser)}>Toggle Selected Status</button> : null}
                  </div>
                </div> : null}
            </section> : null}

          <section className="admin-panels">
            {(activeSection === 'dashboard' || activeSection === 'validation' || activeSection === 'settings') ? <div className="admin-panel">
                <div className="admin-panel__header admin-panel__header--split">
                  <h2>{activeSection === 'settings' ? 'Platform Settings' : 'Product Validation'}</h2>
                  {activeSection !== 'settings' ? <div className="dash-toolbar__group">
                      <button type="button" className="dash-btn dash-btn--compact" onClick={() => setShowResolvedValidations(value => !value)}>
                        {showResolvedValidations ? 'Hide Resolved' : 'Show Resolved'}
                      </button>
                      <button type="button" className="dash-btn dash-btn--compact" onClick={() => setActiveSection('validation')}>
                        Focus
                      </button>
                    </div> : null}
                </div>

                {activeSection !== 'settings' ? <>
                    <div className="admin-validation">
                      {visibleValidations.map(item => <article className={selectedValidationId === item.id ? 'is-selected' : undefined} key={item.id}>
                          <div className="admin-validation__media" aria-hidden="true" />
                          <h3>{item.name}</h3>
                          <p>{item.farmer}</p>
                          <span>Location: {item.location}</span>
                          <div className="admin-validation__badges">
                            <span className={statusBadge(item.status)}>{item.status}</span>
                            <span className={`dash-status ${item.riskScore === 'Low' ? 'dash-status--success' : 'dash-status--warning'}`}>{item.riskScore} Risk</span>
                          </div>
                          <button type="button" onClick={() => {
                        setSelectedValidationId(item.id);
                        setActiveSection('validation');
                      }}>View</button>
                        </article>)}
                    </div>

                    {selectedValidation ? <div className="dash-section admin-validation__detail">
                        <div className="dash-toolbar">
                          <div>
                            <p className="dash-section__title">{selectedValidation.id} • {selectedValidation.name}</p>
                            <p className="dash-section__subtitle">{selectedValidation.farmer} • {selectedValidation.location} • {selectedValidation.category}</p>
                          </div>
                          <span className={statusBadge(selectedValidation.status)}>{selectedValidation.status}</span>
                        </div>
                        <div className="admin-validation__meta-grid">
                          <span>Qty: {selectedValidation.quantityKg} kg</span>
                          <span>Price: {formatDh(selectedValidation.pricePerKg)}/kg</span>
                          <span>Submitted: {formatStamp(selectedValidation.submittedAt)}</span>
                        </div>
                        <p className="dash-inline-note">{selectedValidation.note}</p>
                        <label className="dash-label">
                          Review comment
                          <textarea className="dash-textarea" value={reviewComment} onChange={event => setReviewComment(event.target.value)} placeholder="Approval note or requested changes" />
                        </label>
                        <div className="dash-form-actions">
                          <button type="button" className="dash-btn dash-btn--success" onClick={() => reviewValidation('Approved')}>Approve</button>
                          <button type="button" className="dash-btn" onClick={() => reviewValidation('Changes Requested')}>Request Changes</button>
                          <button type="button" className="dash-btn dash-btn--danger" onClick={() => reviewValidation('Rejected')}>Reject</button>
                        </div>
                      </div> : null}
                  </> : <div className="admin-settings">
                    <div className="dash-panel-stack">
                      <div className="dash-switch">
                        <div className="dash-switch__meta">
                          <strong>Maintenance Mode</strong>
                          <span>Pause new checkouts while keeping browsing active.</span>
                        </div>
                        <button type="button" className={`dash-btn dash-btn--compact ${settingsState.maintenanceMode ? 'dash-btn--danger' : 'dash-btn--success'}`} onClick={() => toggleSetting('maintenanceMode')}>
                          {settingsState.maintenanceMode ? 'On' : 'Off'}
                        </button>
                      </div>
                      <div className="dash-switch">
                        <div className="dash-switch__meta">
                          <strong>Auto-Approve Trusted Farmers</strong>
                          <span>Skip manual moderation for trusted vendor listings.</span>
                        </div>
                        <button type="button" className={`dash-btn dash-btn--compact ${settingsState.autoApproveTrustedFarmers ? 'dash-btn--success' : ''}`} onClick={() => toggleSetting('autoApproveTrustedFarmers')}>
                          {settingsState.autoApproveTrustedFarmers ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      <div className="dash-switch">
                        <div className="dash-switch__meta">
                          <strong>Email Moderation Alerts</strong>
                          <span>Notify admins when risk scoring or moderation queue spikes.</span>
                        </div>
                        <button type="button" className={`dash-btn dash-btn--compact ${settingsState.emailModerationAlerts ? 'dash-btn--success' : ''}`} onClick={() => toggleSetting('emailModerationAlerts')}>
                          {settingsState.emailModerationAlerts ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      <div className="dash-section">
                        <p className="dash-section__title">Thresholds</p>
                        <div className="dash-field-grid">
                          <label className="dash-label">
                            Max daily listings / farmer
                            <input className="dash-input" type="number" min="1" value={settingsState.maxDailyListings} onChange={event => setSettingsState(current => ({
                          ...current,
                          maxDailyListings: Math.max(1, Number.parseInt(event.target.value, 10) || 1)
                        }))} />
                          </label>
                          <label className="dash-label">
                            Platform fee (%)
                            <input className="dash-input" type="number" min="0" max="30" value={settingsState.platformFeePercent} onChange={event => setSettingsState(current => ({
                          ...current,
                          platformFeePercent: Math.min(30, Math.max(0, Number.parseInt(event.target.value, 10) || 0))
                        }))} />
                          </label>
                        </div>
                        <div className="dash-form-actions">
                          <button type="button" className="dash-btn dash-btn--primary" onClick={() => {
                        pushAudit('Saved platform settings', 'success');
                        pushNotice('Platform settings saved.', 'success');
                      }}>Save Settings</button>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div> : null}

            {(activeSection === 'dashboard' || activeSection === 'stats' || activeSection === 'settings') ? <div className="admin-panel">
                <div className="admin-panel__header admin-panel__header--split">
                  <h2>{activeSection === 'settings' ? 'Audit Log' : 'Platform Stats'}</h2>
                  {activeSection !== 'settings' ? <div className="dash-tabs">
                      {['weekly', 'monthly', 'quarterly'].map(range => <button key={range} type="button" className={`dash-tab${reportRange === range ? ' is-active' : ''}`} onClick={() => setReportRange(range)}>
                          {range[0].toUpperCase() + range.slice(1)}
                        </button>)}
                    </div> : null}
                </div>

                {activeSection !== 'settings' ? <div className="admin-platform">
                    <div className="admin-platform__summary">
                      <div>
                        <h3>{chartTotal}</h3>
                        <p>{reportRange} traffic score</p>
                      </div>
                      <div>
                        <h3>{formatDh(chartTotal * settingsState.platformFeePercent * 18)}</h3>
                        <p>Projected fee revenue</p>
                      </div>
                    </div>
                    <div className="admin-platform__chart admin-platform__chart--bars">
                      <div className="dash-chart-bars">
                        {chartSeries.map(item => <div className="dash-chart-bars__item" key={item.label}>
                            <div className="dash-chart-bars__value">{item.value}</div>
                            <div className="dash-chart-bars__col" style={{
                          height: `${Math.max(18, Math.round(item.value / maxChartValue * 108))}px`
                        }} />
                            <div className="dash-chart-bars__label">{item.label}</div>
                          </div>)}
                      </div>
                    </div>
                    <div className="dash-section">
                      <p className="dash-section__title">Moderation throughput</p>
                      <div className="dash-metric-bars">
                        <div className="dash-metric-bars__row">
                          <div className="dash-metric-bars__head"><span>Pending validations</span><span>{pendingValidationCount}</span></div>
                          <div className="dash-metric-bars__track"><div className="dash-metric-bars__fill" style={{
                        width: `${Math.max(10, Math.round(pendingValidationCount / Math.max(validations.length, 1) * 100))}%`
                      }} /></div>
                        </div>
                        <div className="dash-metric-bars__row">
                          <div className="dash-metric-bars__head"><span>Approved listings</span><span>{approvedValidationCount}</span></div>
                          <div className="dash-metric-bars__track"><div className="dash-metric-bars__fill" style={{
                        width: `${Math.max(10, Math.round(approvedValidationCount / Math.max(validations.length, 1) * 100))}%`
                      }} /></div>
                        </div>
                      </div>
                    </div>
                    <div className="admin-platform__footer">
                      <span>{formatDh(estimatedRevenueDh)}</span>
                      <div className="dash-toolbar__group">
                        <button type="button" className="dash-btn" onClick={() => setActiveSection('stats')}>View Full Report</button>
                        <button type="button" className="dash-btn dash-btn--primary" onClick={() => {
                      pushAudit(`Exported ${reportRange} platform report`, 'success');
                      pushNotice(`${reportRange} report export started (demo).`, 'success');
                    }}>Export</button>
                      </div>
                    </div>
                  </div> : <div className="dash-panel-stack">
                    <div className="dash-section">
                      <p className="dash-section__title">Recent admin activity</p>
                      <div className="dash-log">
                        {auditLog.map(entry => <div className="dash-log__item" key={entry.id}>
                            <p>{entry.text}</p>
                            <div className="dash-log__time">{formatStamp(entry.createdAt)}</div>
                          </div>)}
                      </div>
                    </div>
                    <div className="dash-section">
                      <p className="dash-section__title">Quick actions</p>
                      <div className="dash-form-actions">
                        <button type="button" className="dash-btn dash-btn--success" onClick={() => {
                      pushAudit('Triggered moderation queue refresh', 'info');
                      pushNotice('Moderation queue refreshed (demo).', 'success');
                    }}>Refresh Queue</button>
                        <button type="button" className="dash-btn" onClick={() => setActiveSection('users')}>Open Users</button>
                        <button type="button" className="dash-btn" onClick={() => setActiveSection('validation')}>Open Validation</button>
                      </div>
                    </div>
                  </div>}
              </div> : null}
          </section>
        </div>
      </div>
    </div>;
};

export default AdminDashboardPage;