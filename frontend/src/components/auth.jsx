import { demoAccounts } from '../lib/utils';

function DemoLogin({ onQuickLogin }) {
  return (
    <div className="demo-grid">
      {demoAccounts.map((account) => (
        <button key={account.label} className="demo-card" onClick={() => onQuickLogin(account)}>
          <strong>{account.label}</strong>
          <span>{account.email}</span>
          <small>1-click login</small>
        </button>
      ))}
    </div>
  );
}

export function AuthView({ form, setForm, onLogin, onRegister, busy, message, onQuickLogin }) {
  return (
    <section className="shell auth-layout">
      <article className="panel-card auth-card">
        <p className="eyebrow">Access</p>
        <h2>Login</h2>
        <div className="form-grid">
          <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" />
          <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Password" />
        </div>
        <div className="action-row">
          <button className="btn" onClick={onLogin} disabled={busy}>Login</button>
        </div>
        {message ? <p className="note error-text">{message}</p> : null}
        <DemoLogin onQuickLogin={onQuickLogin} />
      </article>

      <article className="panel-card auth-card accent-card">
        <p className="eyebrow">Join</p>
        <h2>Create account</h2>
        <div className="form-grid">
          <input value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Full name" />
          <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" />
          <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Password" />
          <select className="select-base" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
        </div>
        <div className="action-row">
          <button className="btn light" onClick={onRegister} disabled={busy}>Register</button>
        </div>
        <p className="note">Instructor accounts still need admin approval before they can publish courses.</p>
      </article>
    </section>
  );
}
