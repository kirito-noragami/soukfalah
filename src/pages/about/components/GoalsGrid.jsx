import './GoalsGrid.css';
const goals = [{
  title: 'Promote Sustainability',
  text: 'Encourage eco friendly farming practices that protect water and soil.',
  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 21c8 0 14-6 14-14V5h-2c-8 0-14 6-14 14v2h2z" />
        <path d="M7 17c2 0 5-1 7-3" />
      </svg>
}, {
  title: 'Strengthen Communities',
  text: 'Support rural families with stable income and predictable demand.',
  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M4 20c0-3 2-5 4-5s4 2 4 5" />
        <path d="M12 20c0-3 2-5 4-5s4 2 4 5" />
      </svg>
}, {
  title: 'Transparent Pricing',
  text: 'Give buyers clarity while ensuring farmers earn fair compensation.',
  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18" />
        <path d="M16 7H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8" />
      </svg>
}];
const GoalsGrid = () => {
  return <section className="goals-grid">
      <div className="goals-grid__header">
        <h2>Our Goals</h2>
        <p>Focused initiatives that keep farms thriving and food fresh.</p>
      </div>
      <div className="goals-grid__cards">
        {goals.map(goal => <article key={goal.title} className="goals-grid__card">
            <span className="goals-grid__icon" aria-hidden="true">
              {goal.icon}
            </span>
            <h3>{goal.title}</h3>
            <p>{goal.text}</p>
          </article>)}
      </div>
    </section>;
};
export default GoalsGrid;