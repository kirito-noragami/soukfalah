import './RoleSelector.css';
const roles = [{
  id: 'farmer',
  label: 'Farmer'
}, {
  id: 'buyer',
  label: 'Buyer'
}, {
  id: 'admin',
  label: 'Admin'
}];
const RoleSelector = ({
  defaultRole = 'farmer'
}) => {
  return <fieldset className="auth-role">
      <legend className="auth-role__label">Role</legend>
      <div className="auth-role__options">
        {roles.map(role => <label className="auth-role__option" key={role.id}>
            <input type="radio" name="role" value={role.id} defaultChecked={role.id === defaultRole} />
            <span className="auth-role__card">
              <span className="auth-role__icon" aria-hidden="true">
                {role.id === 'farmer' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 20v-6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14c0-4 3-6 6-6 0 4-3 6-6 6Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14c0-3-2-6-6-6 0 3 2 6 6 6Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> : null}
                {role.id === 'buyer' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 8h12l-1 12H7L6 8Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> : null}
                {role.id === 'admin' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="7" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> : null}
              </span>
              <span className="auth-role__text">{role.label}</span>
              <span className="auth-role__chevron" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </label>)}
      </div>
    </fieldset>;
};
export default RoleSelector;
