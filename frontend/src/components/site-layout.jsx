import { LogOut, Menu, Search, Upload, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { useAuth } from '../lib/auth';
import { useLanguage } from '../lib/i18n';

function navClassName({ isActive }) {
  return isActive
    ? 'font-medium text-white'
    : 'text-slate-300 transition hover:text-[#f9b17a]';
}

export function SiteLayout({ children }) {
  const { locale, setLocale } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authMode = location.pathname === '/auth' && location.hash === '#signup' ? 'signup' : 'signin';
  const isAuthPage = location.pathname === '/auth';
  const canUpload = user?.role === 'INSTRUCTOR';

  const copy = locale === 'mn'
    ? {
        tagline: 'Дижитал мэдлэгийг холбох платформ',
        home: 'Нүүр',
        explore: 'Судлах',
        upload: 'Оруулах',
        admin: 'Админ',
        signIn: 'Нэвтрэх',
        signUp: 'Бүртгүүлэх',
        profile: 'Профайл',
        search: 'Хайх',
        menu: 'Цэс',
        close: 'Хаах',
        logout: 'Гарах'
      }
    : {
        tagline: 'Bridge for digital knowledge',
        home: 'Home',
        explore: 'Explore',
        upload: 'Upload',
        admin: 'Admin',
        signIn: 'Sign in',
        signUp: 'Sign up',
        profile: 'Profile',
        search: 'Search',
        menu: 'Menu',
        close: 'Close',
        logout: 'Logout'
      };

  const navItems = [
    { to: '/', label: copy.home, end: true },
    { to: '/explore', label: copy.explore },
    ...(canUpload ? [{ to: '/upload', label: copy.upload }] : []),
    ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: copy.admin }] : [])
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2d3250]/82 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 md:flex-none" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] ring-1 ring-white/20">
              <EduBridgeMark className="h-11 w-11" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-[0.06em] text-white sm:text-base">EDUBRIDGE</p>
              <p className="hidden text-xs text-slate-300 lg:block">{copy.tagline}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `${navClassName({ isActive })} inline-flex min-w-[72px] justify-center`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle locale={locale} setLocale={setLocale} compact />

            <Link to="/explore" aria-label={copy.search} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
              <Search className="h-4 w-4" />
            </Link>

            {canUpload ? (
              <Link to="/upload" className="hidden h-10 min-w-[124px] items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a] sm:inline-flex">
                <Upload className="h-4 w-4" />
                {copy.upload}
              </Link>
            ) : null}

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hidden h-10 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a] lg:inline-flex">
                  <User className="h-4 w-4" />
                  <span className="max-w-[168px] truncate">{user?.fullName || copy.profile}</span>
                </Link>
                <button type="button" onClick={logout} className="hidden h-10 min-w-[104px] items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-2 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] sm:inline-flex">
                  <LogOut className="h-4 w-4" />
                  {copy.logout}
                </button>
              </>
            ) : (
              <>
                {!isAuthPage || authMode !== 'signin' ? (
                  <Link to="/auth#signin" className="hidden h-10 min-w-[104px] items-center justify-center rounded-md bg-[#f9b17a] px-4 py-2 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] sm:inline-flex">
                    {copy.signIn}
                  </Link>
                ) : null}
                {!isAuthPage || authMode !== 'signup' ? (
                  <Link to="/auth#signup" className="hidden h-10 min-w-[112px] items-center justify-center rounded-md border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-[#f9b17a]/60 hover:text-white sm:inline-flex">
                    {copy.signUp}
                  </Link>
                ) : null}
              </>
            )}

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? copy.close : copy.menu}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[#232844]/95 px-4 py-4 md:hidden">
            <div className="page-shell space-y-4">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `${navClassName({ isActive })} rounded-md border border-white/10 px-4 py-3`}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white"
                    >
                      {copy.profile}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="rounded-md bg-[#f9b17a] px-4 py-3 text-center text-sm font-medium text-[#2d3250]"
                    >
                      {copy.logout}
                    </button>
                  </>
                ) : (
                  <>
                    {!isAuthPage || authMode !== 'signin' ? (
                      <Link to="/auth#signin" onClick={() => setMobileMenuOpen(false)} className="rounded-md bg-[#f9b17a] px-4 py-3 text-center text-sm font-medium text-[#2d3250]">
                        {copy.signIn}
                      </Link>
                    ) : null}
                    {!isAuthPage || authMode !== 'signup' ? (
                      <Link to="/auth#signup" onClick={() => setMobileMenuOpen(false)} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white">
                        {copy.signUp}
                      </Link>
                    ) : null}
                  </>
                )}
              </nav>
              <LanguageToggle locale={locale} setLocale={setLocale} />
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <Footer />
    </div>
  );
}

function EduBridgeMark({ className }) {
  return (
    <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect width="72" height="72" rx="10" fill="white" />
      <g stroke="#2B4FAE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M34 22H22C14.82 22 9 27.82 9 35C9 42.18 14.82 48 22 48H36" />
        <path d="M12 35H36" />
        <path d="M44 13V48" />
        <path d="M44 35H53C59.63 35 65 40.37 65 47C65 53.63 59.63 59 53 59H44" />
      </g>
    </svg>
  );
}

function LanguageToggle({ locale, setLocale, compact = false }) {
  return (
    <div className={`${compact ? 'hidden sm:flex' : 'flex'} h-10 items-center rounded-md border border-white/10 bg-white/5 p-1`}>
      <button
        type="button"
        className={locale === 'mn'
          ? 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs font-semibold text-[#f9b17a]'
          : 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs text-slate-300'}
        onClick={() => setLocale('mn')}
      >
        MN
      </button>
      <button
        type="button"
        className={locale === 'en'
          ? 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs font-semibold text-[#f9b17a]'
          : 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs text-slate-300'}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  );
}
