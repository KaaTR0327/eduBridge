import { Heart, LogOut, Menu, Search, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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

  const copy = locale === 'mn'
    ? {
        tagline: 'Дижитал мэдлэгийг холбох платформ',
        home: 'Нүүр',
        explore: 'Судлах',
        upload: 'Оруулах',
        creators: 'Бүтээгчид',
        signIn: 'Нэвтрэх',
        signUp: 'Бүртгүүлэх',
        search: 'Хайх',
        favorites: 'Хадгалсан',
        footerText: 'Дижитал нөөц, мэдлэгийн бүтээгдэхүүн, файл нийтлэх, олох, ашиглахад зориулсан бүтэцтэй платформ.',
        product: 'Платформ',
        categories: 'Ангилал',
        company: 'Тусламж',
        productItems: ['Нөөц хайх', 'Файл оруулах', 'Бүтээгчийн хуудас', 'Хадгалсан зүйлс'],
        categoryItems: ['Код', 'Загвар', 'UI/UX', 'Баримт'],
        companyItems: ['Тухай', 'Тусламж', 'Нөхцөл', 'Нууцлал'],
        menu: 'Цэс',
        close: 'Хаах',
        logout: 'Гарах'
      }
    : {
        tagline: 'Bridge for digital knowledge',
        home: 'Home',
        explore: 'Explore',
        upload: 'Upload',
        creators: 'Creators',
        signIn: 'Sign in',
        signUp: 'Sign up',
        search: 'Search',
        favorites: 'Saved',
        footerText: 'A structured platform for publishing, discovering, and using digital resources and knowledge products.',
        product: 'Platform',
        categories: 'Categories',
        company: 'Support',
        productItems: ['Explore resources', 'Upload files', 'Creator profiles', 'Saved items'],
        categoryItems: ['Code', 'Templates', 'UI/UX', 'Documents'],
        companyItems: ['About', 'Support', 'Terms', 'Privacy'],
        menu: 'Menu',
        close: 'Close',
        logout: 'Logout'
      };

  const navItems = [
    { to: '/', label: copy.home, end: true },
    { to: '/explore', label: copy.explore },
    { to: '/upload', label: copy.upload },
    { to: '/creators/nomin-erdene', label: copy.creators }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2d3250]/82 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/[0.03]">
              <EduBridgeMark className="h-11 w-11 text-[#dfe8f1]" />
            </div>
            <div className="min-w-[172px]">
              <p className="text-base font-extrabold tracking-[0.06em] text-white">EDUBRIDGE</p>
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

          <div className="flex items-center gap-2">
            <LanguageToggle locale={locale} setLocale={setLocale} compact />

            <Link to="/explore" aria-label={copy.search} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
              <Search className="h-4 w-4" />
            </Link>

            <button type="button" aria-label={copy.favorites} className="hidden h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#f9b17a] hover:text-[#f9b17a] sm:inline-flex">
              <Heart className="h-4 w-4" />
            </button>

            <Link to="/upload" className="hidden h-10 min-w-[124px] items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a] sm:inline-flex">
              <Upload className="h-4 w-4" />
              {copy.upload}
            </Link>

            {isAuthenticated ? (
              <>
                <span className="hidden rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 lg:inline-flex">
                  {user?.fullName}
                </span>
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

      <footer className="mt-16 border-t border-white/10 bg-[#232844] text-white">
        <div className="page-shell grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr,0.8fr,0.8fr,0.8fr] lg:px-8">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-[#f9b17a]">EduBridge</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{copy.footerText}</p>
          </div>
          <FooterList title={copy.product} items={copy.productItems} />
          <FooterList title={copy.categories} items={copy.categoryItems} />
          <FooterList title={copy.company} items={copy.companyItems} />
        </div>
      </footer>
    </div>
  );
}

function EduBridgeMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M12 41L28 46L32 54L18 49L12 41Z" fill="currentColor" />
      <path d="M52 41L36 46L32 54L46 49L52 41Z" fill="currentColor" />
      <path d="M15 35L29 39L32 43L20 41L15 35Z" fill="currentColor" opacity="0.95" />
      <path d="M49 35L35 39L32 43L44 41L49 35Z" fill="currentColor" opacity="0.95" />
      <path d="M18 29L30 33L32 36L22 34L18 29Z" fill="currentColor" opacity="0.9" />
      <path d="M46 29L34 33L32 36L42 34L46 29Z" fill="currentColor" opacity="0.9" />
      <path d="M30 12H34V27H30V12Z" fill="currentColor" />
      <path d="M27 8H37V13H27V8Z" fill="currentColor" />
      <path d="M28 27H36V31H28V27Z" fill="currentColor" />
      <path d="M24 12L15 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 12L49 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 31L32 40L40 31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 22H38" stroke="currentColor" strokeWidth="2" />
      <path d="M26 26H38" stroke="currentColor" strokeWidth="2" />
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

function FooterList({ title, items }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#f9b17a]">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
