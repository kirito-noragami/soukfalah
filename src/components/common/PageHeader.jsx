import Breadcrumbs from './Breadcrumbs';
import './PageHeader.css';
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions
}) => {
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;
  return <section className="page-header">
      <div className="page-header__inner">
        {(hasBreadcrumbs || actions) && <div className="page-header__top">
            {hasBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {actions && <div className="page-header__actions">{actions}</div>}
          </div>}
        <div className="page-header__content">
          <h1 className="page-header__title">{title}</h1>
          {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
        </div>
      </div>
    </section>;
};
export default PageHeader;