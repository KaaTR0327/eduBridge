import { Search } from 'lucide-react';

export function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search resources, creators, or tags',
  label = 'Search resources',
  className = '',
  autoFocus = false
}) {
  return (
    <label className={`flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3 shadow-soft-premium backdrop-blur ${className}`}>
      <Search className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border-none bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300"
      />
    </label>
  );
}
