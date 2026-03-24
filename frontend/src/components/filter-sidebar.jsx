import { getCategoryLabel, getLanguageLabel, getLevelLabel } from '../lib/content';

const priceOptions = ['free', 'paid', 'under-20', '20-plus'];
const fileTypeOptions = ['Mongolian', 'English', 'Beginner', 'Intermediate', 'Advanced'];

export function FilterSidebar({
  locale,
  categories,
  selectedCategories,
  selectedPriceFilters,
  selectedFileTypes,
  onToggleCategory,
  onTogglePrice,
  onToggleFileType,
  onReset
}) {
  const copy = locale === 'mn'
    ? {
        title: 'Шүүлтүүр',
        categories: 'Ангилал',
        price: 'Үнэ',
        fileType: 'Хэл ба түвшин',
        reset: 'Шүүлтүүр цэвэрлэх',
        prices: {
          free: 'Зөвхөн үнэгүй',
          paid: 'Зөвхөн төлбөртэй',
          'under-20': '$20-аас доош',
          '20-plus': '$20 ба түүнээс дээш'
        }
      }
    : {
        title: 'Filters',
        categories: 'Categories',
        price: 'Price',
        fileType: 'Language & level',
        reset: 'Reset filters',
        prices: {
          free: 'Free only',
          paid: 'Paid only',
          'under-20': 'Under $20',
          '20-plus': '$20 and above'
        }
      };

  return (
    <aside className="space-y-8 rounded-md border border-white/10 bg-[#424769] p-5 text-white shadow-soft-premium">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:text-[#f9b17a]"
        >
          {copy.reset}
        </button>
      </div>

      <FilterGroup title={copy.categories}>
        {categories.map((category) => (
          <FilterCheckbox
            key={category}
            label={getCategoryLabel(category, locale)}
            checked={selectedCategories.includes(category)}
            onChange={() => onToggleCategory(category)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={copy.price}>
        {priceOptions.map((item) => (
          <FilterCheckbox
            key={item}
            label={copy.prices[item]}
            checked={selectedPriceFilters.includes(item)}
            onChange={() => onTogglePrice(item)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={copy.fileType}>
        {fileTypeOptions.map((item) => (
          <FilterCheckbox
            key={item}
            label={getLanguageLabel(item, locale) || getLevelLabel(item, locale) || item}
            checked={selectedFileTypes.includes(item)}
            onChange={() => onToggleFileType(item)}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]"
      />
      <span>{label}</span>
    </label>
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
