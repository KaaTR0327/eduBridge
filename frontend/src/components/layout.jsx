import { formatCurrency } from '../lib/utils';

export function Hero({ overview, onBrowse, authUser, onOpenPanel }) {
  return (
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow">Shine Marketplace</p>
        <h1>Teach, approve, sell, learn.</h1>
        <p className="lead">{overview?.summary || 'Multi-instructor marketplace with admin moderation and video-based learning.'}</p>
        <div className="hero-actions">
          <button className="btn" onClick={onBrowse}>Browse courses</button>
          {authUser ? <button className="btn ghost" onClick={onOpenPanel}>Open my panel</button> : null}
        </div>
        <div className="chips">
          <span>Video-first courses</span>
          <span>Admin approval workflow</span>
          <span>Role-based dashboards</span>
        </div>
      </div>
      <div className="hero-side">
        <div className="status-panel">
          <span className="eyebrow">Live Metrics</span>
          <div className="metric-stack">
            <div>
              <strong>{overview?.metrics?.totalCourses || 0}</strong>
              <span>Courses</span>
            </div>
            <div>
              <strong>{overview?.metrics?.totalUsers || 0}</strong>
              <span>Users</span>
            </div>
            <div>
              <strong>{formatCurrency(overview?.metrics?.totalRevenue || 0)}</strong>
              <span>Revenue</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Header({ authUser, currentView, onChangeView, onLogout }) {
  const panelLabel = authUser?.role === 'ADMIN'
    ? 'Admin'
    : authUser?.role === 'INSTRUCTOR'
      ? 'Instructor'
      : 'Student';

  return (
    <header className="shell topbar">
      <div>
        <p className="brand">Shine</p>
        <span className="brand-sub">Course marketplace</span>
      </div>
      <nav className="nav-links">
        <button className={currentView === 'home' ? 'nav-btn active' : 'nav-btn'} onClick={() => onChangeView('home')}>Home</button>
        <button className={currentView === 'courses' ? 'nav-btn active' : 'nav-btn'} onClick={() => onChangeView('courses')}>Courses</button>
        {authUser ? <button className={currentView === 'panel' ? 'nav-btn active' : 'nav-btn'} onClick={() => onChangeView('panel')}>{panelLabel} Panel</button> : null}
      </nav>
      <div className="auth-zone">
        {authUser ? (
          <>
            <div className="user-pill">
              <span>{authUser.fullName}</span>
              <small>{authUser.role}</small>
            </div>
            <button className="btn ghost" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className={currentView === 'auth' ? 'btn ghost active' : 'btn ghost'} onClick={() => onChangeView('auth')}>Login</button>
        )}
      </div>
    </header>
  );
}

export function HomeSections({ overview }) {
  const stats = overview ? [
    { label: 'Users', value: overview.metrics.totalUsers },
    { label: 'Instructors', value: overview.metrics.totalInstructors },
    { label: 'Courses', value: overview.metrics.totalCourses },
    { label: 'Revenue', value: formatCurrency(overview.metrics.totalRevenue) }
  ] : [];

  return (
    <section className="shell home-sections">
      <div className="stats-grid compact-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <span className="eyebrow">Metric</span>
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
