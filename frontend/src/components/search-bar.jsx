import { Search } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export function SearchBar({
  value = '',
  onChange,
  placeholder,
  label,
  className = '',
  autoFocus = false
}) {
  const { locale } = useLanguage();
  const resolvedPlaceholder = placeholder || (locale === 'mn' ? 'Нөөц, бүтээгч, эсвэл tag хайх' : 'Search resources, creators, or tags');
  const resolvedLabel = label || (locale === 'mn' ? 'Нөөц хайх' : 'Search resources');

  return (
    <label className={`flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3 shadow-soft-premium backdrop-blur ${className}`}>
      <Search className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
      <span className="sr-only">{resolvedLabel}</span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={resolvedPlaceholder}
        autoFocus={autoFocus}
        className="w-full border-none bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300"
      />
    </label>
  );
}
