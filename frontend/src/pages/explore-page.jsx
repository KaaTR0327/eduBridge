import { SlidersHorizontal, X } from 'lucide-react';
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/filter-sidebar';
import { ResourceCard } from '../components/resource-card';
import { SearchBar } from '../components/search-bar';
import { fetchCategories, fetchResources, getCategoryLabel, getLanguageLabel, getLevelLabel } from '../lib/content';
import { useLanguage } from '../lib/i18n';

const tags = ['React', 'Design', 'Mongolian', 'English', 'Beginner', 'Intermediate', 'Advanced'];

export function ExplorePage() {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deferredSearch = useDeferredValue(searchValue.trim().toLowerCase());

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [resourceData, categoryData] = await Promise.all([fetchResources(), fetchCategories()]);
        if (active) {
          setResources(resourceData);
          setCategories(categoryData.map((item) => item.name));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const copy = locale === 'mn'
    ? {
        eyebrow: 'Хичээл судлах',
        title: 'Хэрэгтэй дижитал хичээл, бүтээгчийн контент, сургалтын материалыг олоорой',
        description: 'EduBridge нь бүтээгч, ангилал, tag, preview ашиглан хэрэгтэй хичээлийг хурдан олоход тусална.',
        searchPlaceholder: 'Гарчиг, бүтээгч, ангилал, хэл эсвэл түвшнээр хайх',
        filters: 'Шүүлтүүр',
        close: 'Хаах',
        resourcesAvailable: 'хичээл байна',
        noResultsTitle: 'Тохирох хичээл олдсонгүй',
        noResultsBody: 'Хайлтын үг эсвэл шүүлтүүрээ өөрчлөөд дахин шалгана уу.',
        loadError: 'Хичээл ачаалж чадсангүй.',
        loading: 'Хичээлүүдийг ачаалж байна...',
        clearAll: 'Бүгдийг цэвэрлэх',
        priceLabels: {
          free: 'Зөвхөн үнэгүй',
          paid: 'Зөвхөн төлбөртэй',
          'under-20000': '20000-аас доош',
          '20000-plus': '20000 ба түүнээс дээш'
        },
        sorts: {
          newest: 'Шинэ',
          trending: 'Тренд',
          downloads: 'Хамгийн их таталттай',
          rating: 'Хамгийн өндөр үнэлгээтэй',
          priceLow: 'Үнэ өсөхөөр',
          priceHigh: 'Үнэ буурахаар'
        }
      }
    : {
        eyebrow: 'Explore resources',
        title: 'Discover digital resources, creator content, and structured learning materials',
        description: 'EduBridge helps people find useful resources quickly through creators, categories, tags, and clean previews.',
        searchPlaceholder: 'Search by title, creator, category, language, or level',
        filters: 'Filters',
        close: 'Close',
        resourcesAvailable: 'resources available',
        noResultsTitle: 'No resources matched your filters',
        noResultsBody: 'Try changing the search query or clearing a few filters.',
        loadError: 'Unable to load resources.',
        loading: 'Loading resources...',
        clearAll: 'Clear all filters',
        priceLabels: {
          free: 'Free only',
          paid: 'Paid only',
          'under-20000': 'Under 20000',
          '20000-plus': '20000 and above'
        },
        sorts: {
          newest: 'Newest',
          trending: 'Trending',
          downloads: 'Most downloaded',
          rating: 'Highest rated',
          priceLow: 'Price: low to high',
          priceHigh: 'Price: high to low'
        }
      };

  const filteredResources = useMemo(() => {
    const matchesSearch = (resource) => {
      if (!deferredSearch) return true;
      const haystack = [
        resource.title,
        resource.titleMn,
        resource.description,
        resource.descriptionMn,
        resource.shortDescription,
        resource.shortDescriptionMn,
        resource.language,
        resource.level,
        resource.creator?.name,
        resource.category,
        ...resource.tags
      ].join(' ').toLowerCase();
      return haystack.includes(deferredSearch);
    };

    const matchesTag = (resource) => selectedTags.length === 0 || selectedTags.some((tag) => (
      resource.tags.includes(tag) ||
      resource.language === tag ||
      resource.level === tag ||
      resource.category === tag
    ));

    const matchesCategory = (resource) => selectedCategories.length === 0 || selectedCategories.includes(resource.category);

    const matchesFileType = (resource) => selectedFileTypes.length === 0 || selectedFileTypes.some((type) => (
      resource.language === type || resource.level === type
    ));

    const matchesPrice = (resource) => {
      if (selectedPriceFilters.length === 0) return true;
      return selectedPriceFilters.some((filter) => {
        if (filter === 'free') return resource.isFree;
        if (filter === 'paid') return !resource.isFree;
        if (filter === 'under-20') return !resource.isFree && resource.price < 20;
        if (filter === '20-plus') return !resource.isFree && resource.price >= 20;
        return true;
      });
    };

    const sorted = resources.filter((resource) => (
      matchesSearch(resource) &&
      matchesTag(resource) &&
      matchesCategory(resource) &&
      matchesFileType(resource) &&
      matchesPrice(resource)
    ));

    sorted.sort((left, right) => {
      if (sortBy === 'downloads') return right.downloads - left.downloads;
      if (sortBy === 'rating') return right.rating - left.rating;
      if (sortBy === 'priceLow') return (left.isFree ? 0 : left.price) - (right.isFree ? 0 : right.price);
      if (sortBy === 'priceHigh') return (right.isFree ? 0 : right.price) - (left.isFree ? 0 : left.price);
      if (sortBy === 'trending') return (right.downloads + right.favorites) - (left.downloads + left.favorites);

      const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
      const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
      return rightDate - leftDate;
    });

    return sorted;
  }, [deferredSearch, resources, selectedTags, selectedCategories, selectedFileTypes, selectedPriceFilters, sortBy]);

  const toggleFromList = (value, current, setter) => {
    startTransition(() => {
      setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      setSelectedTags([]);
      setSelectedCategories([]);
      setSelectedPriceFilters([]);
      setSelectedFileTypes([]);
      setSearchValue('');
      setSortBy('newest');
    });

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setSearchValue(nextValue);

    const nextParams = new URLSearchParams(searchParams);
    if (nextValue.trim()) {
      nextParams.set('q', nextValue);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const filterSidebar = (
    <FilterSidebar
      locale={locale}
      categories={categories}
      selectedCategories={selectedCategories}
      selectedPriceFilters={selectedPriceFilters}
      selectedFileTypes={selectedFileTypes}
      onToggleCategory={(value) => toggleFromList(value, selectedCategories, setSelectedCategories)}
      onTogglePrice={(value) => toggleFromList(value, selectedPriceFilters, setSelectedPriceFilters)}
      onToggleFileType={(value) => toggleFromList(value, selectedFileTypes, setSelectedFileTypes)}
      onReset={resetFilters}
    />
  );

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent p-5 sm:p-8">
        <p className="eyebrow-text">{copy.eyebrow}</p>
        <h1 className="page-title mt-3 text-white">{copy.title}</h1>
        <p className="body-copy mt-4">{copy.description}</p>
      </div>

      <div className="mt-8">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={copy.searchPlaceholder}
          label={copy.eyebrow}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          const label = getLanguageLabel(tag, locale) || getLevelLabel(tag, locale) || getCategoryLabel(tag, locale) || tag;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleFromList(tag, selectedTags, setSelectedTags)}
              className={`rounded-sm border px-3 py-2 text-sm font-medium transition ${active ? 'border-[#f9b17a] bg-[#f9b17a]/15 text-[#f9b17a]' : 'border-white/10 bg-white/10 text-slate-200 hover:border-[#f9b17a] hover:text-[#f9b17a]'}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px,1fr] lg:gap-8">
        <div className="hidden lg:block">{filterSidebar}</div>

        <div>
          <div className="surface-panel flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {copy.filters}
              </button>
              <p className="text-sm text-slate-200">
                {loading ? copy.loading : error ? copy.loadError : `${filteredResources.length} ${copy.resourcesAvailable}`}
              </p>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="select-base w-full sm:max-w-[240px]">
                {Object.entries(copy.sorts).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            {(selectedCategories.length > 0 || selectedFileTypes.length > 0 || selectedPriceFilters.length > 0 || selectedTags.length > 0 || searchValue) ? (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <ActiveChip key={category} label={getCategoryLabel(category, locale)} onRemove={() => toggleFromList(category, selectedCategories, setSelectedCategories)} />
                ))}
                {selectedFileTypes.map((type) => (
                  <ActiveChip key={type} label={getLanguageLabel(type, locale) || getLevelLabel(type, locale) || type} onRemove={() => toggleFromList(type, selectedFileTypes, setSelectedFileTypes)} />
                ))}
                {selectedPriceFilters.map((filter) => (
                  <ActiveChip key={filter} label={copy.priceLabels[filter] || filter} onRemove={() => toggleFromList(filter, selectedPriceFilters, setSelectedPriceFilters)} />
                ))}
                {selectedTags.map((tag) => (
                  <ActiveChip key={tag} label={getLanguageLabel(tag, locale) || getLevelLabel(tag, locale) || getCategoryLabel(tag, locale) || tag} onRemove={() => toggleFromList(tag, selectedTags, setSelectedTags)} />
                ))}
                {searchValue ? <ActiveChip label={searchValue} onRemove={() => setSearchValue('')} /> : null}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="empty-state mt-6">
              <h2 className="text-xl font-semibold text-white">{copy.loadError}</h2>
              <p className="mt-3">{error}</p>
            </div>
          ) : loading ? (
            <div className="empty-state mt-6">
              <h2 className="text-xl font-semibold text-white">{copy.loading}</h2>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
            </div>
          ) : (
            <div className="empty-state mt-6">
              <h2 className="text-xl font-semibold text-white">{copy.noResultsTitle}</h2>
              <p className="mt-3">{copy.noResultsBody}</p>
              <button type="button" onClick={resetFilters} className="mt-5 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]">
                {copy.clearAll}
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 px-4 py-6 lg:hidden">
          <div className="mx-auto max-h-[calc(100vh-3rem)] max-w-md overflow-y-auto rounded-md border border-white/10 bg-[#232844] p-4 shadow-soft-premium">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">{copy.filters}</p>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-slate-200">
                <X className="h-4 w-4" />
                <span className="sr-only">{copy.close}</span>
              </button>
            </div>
            {filterSidebar}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-[#f9b17a]/35 bg-[#f9b17a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#f9b17a]"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}
