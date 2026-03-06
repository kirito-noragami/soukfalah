import './Breadcrumbs.css';
const Breadcrumbs = ({
  items,
  className
}) => {
  const navClassName = className ? `breadcrumbs ${className}` : 'breadcrumbs';
  return <nav className={navClassName} aria-label="Breadcrumbs">
      <ol>
        {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? <a href={item.href}>{item.label}</a> : <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>}
            </li>;
      })}
      </ol>
    </nav>;
};
export default Breadcrumbs;