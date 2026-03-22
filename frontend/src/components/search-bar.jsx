import { Search } from 'lucide-react';

export function SearchBar({ placeholder = 'Search resources, creators, or tags' }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3 shadow-soft-premium backdrop-blur">
      <Search className="h-4 w-4 text-slate-300" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-none bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300"
      />
    </div>
  );
}
