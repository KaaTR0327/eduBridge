import { categories } from '../data/marketplace';

export function FilterSidebar() {
  return (
    <aside className="space-y-8 rounded-md border border-white/10 bg-[#424769] p-5 text-white shadow-soft-premium">
      <FilterGroup title="Categories">
        {categories.map((category) => (
          <label key={category} className="flex items-center gap-3 text-sm text-slate-200">
            <input type="checkbox" className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]" />
            <span>{category}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {['Free only', 'Paid only', 'Under $20', '$20 and above'].map((item) => (
          <label key={item} className="flex items-center gap-3 text-sm text-slate-200">
            <input type="checkbox" className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]" />
            <span>{item}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="File type">
        {['Figma', 'PDF', 'ZIP', 'Notion', 'SVG'].map((item) => (
          <label key={item} className="flex items-center gap-3 text-sm text-slate-200">
            <input type="checkbox" className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]" />
            <span>{item}</span>
          </label>
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#f9b17a]">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}
