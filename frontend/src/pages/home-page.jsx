import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { HeroModelViewer } from '../components/hero-model-viewer';
import { ResourceCard } from '../components/resource-card';
import { SearchBar } from '../components/search-bar';
import { SectionHeading } from '../components/section-heading';
import { fallbackHowItWorks, fetchCategories, fetchCreators, fetchResources, getCategoryLabel, getLocalizedField } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function HomePage() {
  const { locale } = useLanguage();
  const [resources, setResources] = useState([]);
  const [creators, setCreators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [resourceData, creatorData, categoryData] = await Promise.all([
          fetchResources(),
          fetchCreators(),
          fetchCategories()
        ]);
        if (active) {
          setResources(resourceData);
          setCreators(creatorData);
          setCategories(categoryData.map((item) => item.name));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const featuredResources = useMemo(() => resources.slice(0, 4), [resources]);
  const trendingResources = useMemo(() => [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 4), [resources]);
  const featuredCreator = creators[0];

  const copy = locale === 'mn'
    ? {
        eyebrow: 'Ирээдүйд бэлэн дижитал нөөцийн платформ',
        heroTitle: 'EduBridge мэдлэгийг бодит дижитал marketplace болгоно.',
        heroBody: 'Код, тэмдэглэл, загвар, сургалтын материал болон бүтээгчдийн нөөцийг нэг дороос нийтэлж, олж, ашиглах боломжтой.',
        explore: 'Нөөц үзэх',
        upload: 'Нөөц нийтлэх',
        loading: 'Хуудсыг ачаалж байна...',
        why: 'Яагаад EduBridge',
        whyTitle: 'Хэрэгтэй мэдлэг, бүтээгч, дижитал нөөцийг нэг дор холбосон төв орчин.',
        whyBody: 'EduBridge нь бүтээгчдэд нийтлэх, хэрэглэгчдэд олох, багуудад хэрэгтэй материалаа дахин ашиглах боломж олгоно.',
        categories: 'Ангилал',
        categoriesTitle: 'Хүмүүс яг хэрэгтэй зүйлээрээ хайдаг',
        categoriesDesc: 'Ангилал нь хэрэгтэй нөөцийг илүү хурдан олоход тусална.',
        featured: 'Онцлох',
        featuredTitle: 'Онцлох нөөцүүд',
        featuredDesc: 'Шинэ, хэрэгтэй, бүтэцтэй нөөцүүд.',
        trending: 'Тренд',
        trendingTitle: 'Их анхаарал татаж буй нөөцүүд',
        trendingDesc: 'Таталт болон хэрэглэгчийн сонирхлоор тэргүүлж буй нөөцүүд.',
        creator: 'Бүтээгч',
        creatorTitle: 'Онцлох бүтээгч',
        downloads: 'Таталт',
        rating: 'Үнэлгээ',
        reviews: 'Сэтгэгдэл',
        creatorButton: 'Бүтээгчийн хуудас',
        how: 'Хэрхэн ажилладаг',
        howTitle: 'Бүтээгч, хэрэглэгч хоёрт хоёуланд нь энгийн',
        howDesc: 'Нийтлэхээс эхлээд олж авах хүртэлх урсгал ойлгомжтой байдаг.',
        viewAll: 'Бүгдийг үзэх'
      }
    : {
        eyebrow: 'Future-ready digital resource platform',
        heroTitle: 'EduBridge turns knowledge into a real digital marketplace.',
        heroBody: 'Publish, discover, and use code, notes, templates, learning materials, and creator resources from one focused ecosystem.',
        explore: 'Explore resources',
        upload: 'Publish resources',
        loading: 'Loading page...',
        why: 'Why EduBridge',
        whyTitle: 'One focused place for useful knowledge, creators, and digital resources.',
        whyBody: 'EduBridge helps creators publish, users discover, and teams return to the resources they actually use.',
        categories: 'Categories',
        categoriesTitle: 'Browse by what people actually need',
        categoriesDesc: 'Categories help users find practical resources faster.',
        featured: 'Featured',
        featuredTitle: 'Featured resources',
        featuredDesc: 'Useful, recent, and structured resources.',
        trending: 'Trending',
        trendingTitle: 'Most active resources',
        trendingDesc: 'Popular resources based on engagement and usage.',
        creator: 'Creator highlight',
        creatorTitle: 'Creator highlight',
        downloads: 'Downloads',
        rating: 'Rating',
        reviews: 'Reviews',
        creatorButton: 'View creator profile',
        how: 'How it works',
        howTitle: 'Simple for creators and useful for users.',
        howDesc: 'The flow stays clear from publishing to discovery.',
        viewAll: 'View all'
      };

  if (loading) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">{copy.loading}</div>
      </main>
    );
  }

  return (
    <main>
      <section className="hero-panel relative min-h-[calc(100vh-73px)] overflow-hidden border-b border-white/10">
        <div className="hero-overlay absolute inset-0" />
        <div className="grid-fade absolute inset-0 opacity-60" />

        <div className="page-shell relative grid min-h-[calc(100vh-73px)] items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[0.94fr,1.06fr] lg:px-8">
          <div className="animate-rise max-w-2xl">
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h1 className="hero-title mt-4 text-white">{copy.heroTitle}</h1>
            <p className="body-copy mt-6 max-w-xl">{copy.heroBody}</p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/explore" className="rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
                {copy.explore}
              </Link>
              <Link to="/upload" className="rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10">
                {copy.upload}
              </Link>
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div className="hero-immersive hero-immersive-clean media-tilt rounded-md border border-white/10 bg-[#2d3250]/88 shadow-soft-premium">
              <div className="hero-scene-glow" />
              <div className="hero-spotlight" />
              <HeroModelViewer />
            </div>
          </div>
        </div>
      </section>

      <SectionBlock>
        <div className="grid gap-6 lg:grid-cols-[0.88fr,1.12fr]">
          <div className="surface-dark rounded-md px-8 py-10 text-white">
            <p className="eyebrow-text">{copy.why}</p>
            <h2 className="section-title mt-3">{copy.whyTitle}</h2>
            <p className="meta-copy mt-5 max-w-xl">{copy.whyBody}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              locale === 'mn' ? 'Нийтлэхэд бэлэн бүтээгчийн орчин' : 'Creator-ready publishing flow',
              locale === 'mn' ? 'Ойлгомжтой нөөцийн preview' : 'Clear resource previews',
              locale === 'mn' ? 'Нэг дор төвлөрсөн нөөцийн сан' : 'Focused resource library'
            ].map((item) => (
              <div key={item} className="surface-panel p-6">
                <h3 className="card-title text-white">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock>
        <SectionHeading eyebrow={copy.categories} title={copy.categoriesTitle} description={copy.categoriesDesc} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category}
              to="/explore"
              className="rounded-md border border-white/10 bg-[#424769] px-4 py-4 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]"
            >
              {getCategoryLabel(category, locale)}
            </Link>
          ))}
        </div>
      </SectionBlock>

      <ResourceSection eyebrow={copy.featured} title={copy.featuredTitle} description={copy.featuredDesc} items={featuredResources} viewAllLabel={copy.viewAll} />
      <ResourceSection eyebrow={copy.trending} title={copy.trendingTitle} description={copy.trendingDesc} items={trendingResources} viewAllLabel={copy.viewAll} />

      {featuredCreator ? (
        <SectionBlock>
          <div className="surface-panel grid gap-10 p-8 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="eyebrow-text">{copy.creator}</p>
              <h2 className="section-title mt-3 text-white">{featuredCreator.name}</h2>
              <p className="text-sm font-medium text-slate-300">{getLocalizedField(featuredCreator, 'role', locale)}</p>
              <p className="meta-copy mt-5 max-w-xl">{getLocalizedField(featuredCreator, 'bio', locale)}</p>
              <div className="mt-6 flex gap-8 text-sm">
                <div>
                  <p className="stat-number text-white">{featuredCreator.totalDownloads.toLocaleString()}</p>
                  <p className="text-slate-300">{copy.downloads}</p>
                </div>
                <div>
                  <p className="stat-number text-white">{featuredCreator.rating}</p>
                  <p className="text-slate-300">{copy.rating}</p>
                </div>
                <div>
                  <p className="stat-number text-white">{featuredCreator.reviewCount}</p>
                  <p className="text-slate-300">{copy.reviews}</p>
                </div>
              </div>
              <Link to={`/creators/${featuredCreator.slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#f9b17a]">
                {copy.creatorButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {resources.filter((item) => item.creatorId === featuredCreator.id).slice(0, 4).map((resource) => (
                <div key={resource.id} className="border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-300">{getCategoryLabel(resource.category, locale)}</p>
                  <h3 className="card-title mt-3 text-base text-white">{getLocalizedField(resource, 'title', locale)}</h3>
                  <p className="meta-copy mt-2">{getLocalizedField(resource, 'shortDescription', locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>
      ) : null}

      <SectionBlock>
        <SectionHeading eyebrow={copy.how} title={copy.howTitle} description={copy.howDesc} />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {fallbackHowItWorks.map((item, index) => (
            <div key={item.title} className="surface-panel p-6">
              <p className="text-sm font-medium text-slate-300">{locale === 'mn' ? `Алхам ${index + 1}` : `Step ${index + 1}`}</p>
              <h3 className="card-title mt-3 text-white">{getLocalizedField(item, 'title', locale)}</h3>
              <p className="meta-copy mt-3">{getLocalizedField(item, 'description', locale)}</p>
            </div>
          ))}
        </div>
      </SectionBlock>
    </main>
  );
}

function SectionBlock({ children }) {
  return <section className="page-shell px-4 py-14 sm:px-6 lg:px-8">{children}</section>;
}

function ResourceSection({ eyebrow, title, description, items, viewAllLabel }) {
  return (
    <SectionBlock>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={(
          <Link to="/explore" className="text-sm font-medium text-slate-200 transition hover:text-[#f9b17a]">
            {viewAllLabel}
          </Link>
        )}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
      </div>
    </SectionBlock>
  );
}
