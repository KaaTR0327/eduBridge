import { SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from '../components/filter-sidebar';
import { ResourceCard } from '../components/resource-card';
import { SearchBar } from '../components/search-bar';
import { resources } from '../data/marketplace';
import { useLanguage } from '../lib/i18n';

const tags = ['React', 'Figma', 'Notion', 'PDF', 'Startup', 'Learning', 'Prompting', 'Assets'];

export function ExplorePage() {
  const { locale } = useLanguage();
  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent p-8">
        <p className="eyebrow-text">{locale === 'mn' ? 'Нөөц хайх' : 'Explore resources'}</p>
        <h1 className="page-title mt-3 text-white">
          {locale === 'mn' ? 'Файл, мэдлэгийн бүтээгдэхүүн, загвар, материал, хэрэгслүүдийг хайх' : 'Discover files, knowledge products, templates, assets, and practical tools'}
        </h1>
        <p className="body-copy mt-4">
          {locale === 'mn' ? 'EduBridge нь ангилал, tag, бүтээгч, бүтэцтэй preview-ээр хэрэгтэй мэдээллийг хурдан олоход тусална.' : 'EduBridge helps people find useful information quickly through categories, tags, creators, and structured previews.'}
        </p>
      </div>

      <div className="mt-8">
        <SearchBar placeholder={locale === 'mn' ? 'Гарчиг, tag, бүтээгч эсвэл файлын төрлөөр хайх' : 'Search by title, tag, creator, or file type'} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} className="rounded-sm border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px,1fr]">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        <div>
          <div className="surface-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              {locale === 'mn' ? 'Шүүлтүүр' : 'Filters'}
            </button>
            <p className="text-sm text-slate-200">{locale === 'mn' ? `${resources.length} нөөц байна` : `${resources.length} resources available`}</p>
            <div className="flex flex-wrap gap-2">
              {['Newest', 'Trending', 'Most downloaded', 'Highest rated'].map((item) => (
                <button key={item} className="rounded-sm border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
