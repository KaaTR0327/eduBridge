import { Heart, Search, Upload } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';

function navClassName({ isActive }) {
  return isActive
    ? 'font-medium text-white'
    : 'text-slate-300 transition hover:text-[#f9b17a]';
}

export function SiteLayout({ children }) {
  const { locale, setLocale } = useLanguage();

  const copy = locale === 'mn'
    ? {
        tagline: 'Дижитал мэдлэгийн гүүр',
        home: 'Нүүр',
        explore: 'Судлах',
        upload: 'Оруулах',
        creators: 'Бүтээгч',
        signIn: 'Нэвтрэх',
        footerText: 'Дижитал нөөц, мэдлэгийн бүтээгдэхүүнийг нийтлэх, олох, худалдах, ашиглахад зориулсан цэгцтэй платформ.',
        product: 'Платформ',
        categories: 'Ангилал',
        company: 'Тусламж',
        productItems: ['Нөөц хайх', 'Файл оруулах', 'Бүтээгчийн хуудас', 'Хадгалсан зүйлс'],
        categoryItems: ['Код', 'Загвар', 'UI/UX', 'Баримт'],
        companyItems: ['Тухай', 'Тусламж', 'Нөхцөл', 'Нууцлал']
      }
    : {
        tagline: 'Bridge for digital knowledge',
        home: 'Home',
        explore: 'Explore',
        upload: 'Upload',
        creators: 'Creators',
        signIn: 'Sign in',
        footerText: 'A structured platform for publishing, discovering, buying, and using digital resources and knowledge products.',
        product: 'Platform',
        categories: 'Categories',
        company: 'Support',
        productItems: ['Explore resources', 'Upload files', 'Creator profiles', 'Saved items'],
        categoryItems: ['Code', 'Templates', 'UI/UX', 'Documents'],
        companyItems: ['About', 'Support', 'Terms', 'Privacy']
      };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2d3250]/82 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f9b17a] text-sm font-semibold text-[#2d3250]">
              E
            </div>
            <div className="min-w-[172px]">
              <p className="text-sm font-semibold tracking-tight text-white">EduBridge</p>
              <p className="hidden text-xs text-slate-300 lg:block">{copy.tagline}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            <NavLink to="/" className={({ isActive }) => `${navClassName({ isActive })} inline-flex min-w-[72px] justify-center`} end>
              {copy.home}
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => `${navClassName({ isActive })} inline-flex min-w-[72px] justify-center`}>
              {copy.explore}
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => `${navClassName({ isActive })} inline-flex min-w-[72px] justify-center`}>
              {copy.upload}
            </NavLink>
            <NavLink to="/creators/maya-lin" className={({ isActive }) => `${navClassName({ isActive })} inline-flex min-w-[88px] justify-center`}>
              {copy.creators}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden h-10 items-center rounded-md border border-white/10 bg-white/5 p-1 sm:flex">
              <button
                className={locale === 'mn'
                  ? 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs font-semibold text-[#f9b17a]'
                  : 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs text-slate-300'}
                onClick={() => setLocale('mn')}
              >
                MN
              </button>
              <button
                className={locale === 'en'
                  ? 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs font-semibold text-[#f9b17a]'
                  : 'inline-flex h-8 min-w-[42px] items-center justify-center rounded px-2 text-xs text-slate-300'}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </div>

            <Link to="/explore" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
              <Search className="h-4 w-4" />
            </Link>

            <button className="hidden h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#f9b17a] hover:text-[#f9b17a] sm:inline-flex">
              <Heart className="h-4 w-4" />
            </button>

            <Link to="/upload" className="hidden h-10 min-w-[124px] items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a] sm:inline-flex">
              <Upload className="h-4 w-4" />
              {copy.upload}
            </Link>

            <Link to="/auth" className="inline-flex h-10 min-w-[104px] items-center justify-center rounded-md bg-[#f9b17a] px-4 py-2 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
              {copy.signIn}
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-16 border-t border-white/10 bg-[#232844] text-white">
        <div className="page-shell grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr,0.8fr,0.8fr,0.8fr] lg:px-8">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-[#f9b17a]">EduBridge</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {copy.footerText}
            </p>
          </div>

          <FooterList title={copy.product} items={copy.productItems} />
          <FooterList title={copy.categories} items={copy.categoryItems} />
          <FooterList title={copy.company} items={copy.companyItems} />
        </div>
      </footer>
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
