import { ArrowRight, Download, ImageIcon, Search, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroModelViewer } from '../components/hero-model-viewer';
import { ResourceCard } from '../components/resource-card';
import { SearchBar } from '../components/search-bar';
import { SectionHeading } from '../components/section-heading';
import { categories, creators, getCategoryLabel, getLocalizedField, howItWorks, resources } from '../data/marketplace';
import { useLanguage } from '../lib/i18n';

const featuredResources = resources.slice(0, 4);
const trendingResources = [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
const freeResources = resources.filter((resource) => resource.isFree).slice(0, 4);
const paidResources = resources.filter((resource) => !resource.isFree).slice(0, 4);
const featuredCreator = creators[0];

const platformBlocks = [
  {
    title: 'Knowledge bridge',
    titleMn: 'Мэдлэгийн гүүр',
    description: 'Organize technical notes, digital files, prompts, design assets, and templates in one discoverable system.',
    descriptionMn: 'Техникийн тэмдэглэл, файл, промпт, дизайны материалыг нэг дор ойлгомжтой бүтэцтэйгээр зохион байгуулна.'
  },
  {
    title: 'Creator economy ready',
    titleMn: 'Бүтээгч төвтэй систем',
    description: 'Support free resources, paid releases, portfolios, digital storefronts, and useful creator trust signals.',
    descriptionMn: 'Үнэгүй ба төлбөртэй бүтээгдэхүүн, portfolio, storefront, trust signal-уудыг дэмжинэ.'
  },
  {
    title: 'Built for clarity',
    titleMn: 'Ойлгомжтой бүтэц',
    description: 'Give every resource a clean preview, readable detail page, tags, creator context, and action-focused layout.',
    descriptionMn: 'Нөөц бүр цэвэр preview, ойлгомжтой detail page, tag, creator context-той байна.'
  }
];

const mediaFormats = [
  {
    label: '3D previews',
    labelMn: '3D preview',
    value: 'Model-inspired product showcases',
    valueMn: 'Model төрлийн бүтээгдэхүүний танилцуулга'
  },
  {
    label: 'Visual covers',
    labelMn: 'Визуал cover',
    value: 'Clean image-driven browsing',
    valueMn: 'Зурагт төвлөрсөн цэвэр browsing'
  },
  {
    label: 'Video demos',
    labelMn: 'Видео demo',
    value: 'Motion previews for premium releases',
    valueMn: 'Premium нөөцөд зориулсан motion preview'
  },
  {
    label: 'Structured files',
    labelMn: 'Бүтэцтэй файл',
    value: 'Guides, notes, code, kits, and docs',
    valueMn: 'Guide, note, code, kit, document төрлүүд'
  }
];

export function HomePage() {
  const { locale } = useLanguage();

  const copy = locale === 'mn'
    ? {
        eyebrow: 'Ирээдүйд бэлэн дижитал нөөцийн платформ',
        heroTitle: 'EduBridge мэдлэгийг жинхэнэ дижитал зах зээл болгоно.',
        heroBody: 'Код, тэмдэглэл, загвар, промпт, дизайны материал, медиа болон premium файлыг нэг дор нийтэлж болно. EduBridge нь хэрэгтэй мэдээлэл ба түүнийг хайж буй хүмүүсийн гол гүүр байхаар бүтээгдсэн.',
        explore: 'Нөөц үзэх',
        upload: 'Нөөц оруулах',
        heroStats: ['нийтлэгдсэн нөөц', 'боловсруулагдсан таталт', 'зураг, видео, файл'],
        why: 'Яагаад EduBridge',
        whyTitle: 'Хэрэгтэй мэдээлэл ба дижитал үнэ цэнийн төв гүүр.',
        whyBody: 'Сурах, хуваалцах, нийтлэх, зарах, итгэл бий болгохыг хүссэн хүмүүст зориулсан платформ. Зөвхөн нэг төрлийн контентоор хязгаарлагдахгүй.',
        experience: 'Нөөцийн туршлага',
        experienceTitle: 'Зөвхөн нэг формат бус, олон төрлийн контентод зориулсан.',
        contentFlow: 'Контентийн урсгал',
        contentTitle: 'Оруулах, preview харах, олох, хадгалах, авах, дахин ашиглах.',
        contentBody: 'Хуудас бүр нөөц яг юу болох, яагаад хэрэгтэйг ойлгуулах ёстой.',
        future: 'Ирээдүйн боломж',
        futureTitle: 'EduBridge мэдээллийн гол солилцооны давхарга болж өснө.',
        futureBody: 'Ингэснээр creator identity, discovery, preview, content ecosystem бүгд илүү хүчтэй болно.',
        categories: 'Ангилал',
        categoriesTitle: 'Хүмүүст яг хэрэгтэй зүйлээр нь хайлга.',
        categoriesDesc: 'Төвлөрсөн ангилал нь хэрэгтэй нөөцийг хурдан олоход тусална.',
        featured: 'Онцлох',
        featuredTitle: 'Онцлох нөөцүүд',
        featuredDesc: 'Сайн preview, тодорхой positioning, хэрэгтэй файлтай нөөцүүд.',
        trending: 'Тренд',
        trendingTitle: 'Тренд нөөцүүд',
        trendingDesc: 'Энэ долоо хоногт хамгийн их анхаарал татсан нөөцүүд.',
        free: 'Үнэгүй',
        freeTitle: 'Үнэгүй нөөцүүд',
        freeDesc: 'Сурах, турших, өдөр тутмын ажилд ашиглах үнэгүй нөөцүүд.',
        paid: 'Төлбөртэй',
        paidTitle: 'Төлбөртэй нөөцүүд',
        paidDesc: 'Илүү гүн, бүтэцтэй, үнэ цэнтэй premium бүтээгдэхүүнүүд.',
        creator: 'Бүтээгч',
        creatorTitle: 'Онцлох бүтээгч',
        downloads: 'Таталт',
        rating: 'Үнэлгээ',
        reviews: 'Сэтгэгдэл',
        creatorButton: 'Бүтээгчийн хуудас',
        how: 'Хэрхэн ажилладаг',
        howTitle: 'Бүтээгчид, хэрэглэгчдэд аль алинд нь энгийн.',
        howDesc: 'Оруулахаас эхлээд татах хүртэлх үйл явцыг ойлгомжтой байлгана.',
        viewAll: 'Бүгдийг үзэх',
        mediaSupport: 'Медиа дэмжлэг',
        mediaValue: 'Зураг, видео, файл',
        publishedResources: 'Нийтлэгдсэн нөөц'
      }
    : {
        eyebrow: 'Future-ready digital resource platform',
        heroTitle: 'EduBridge turns knowledge into a real digital marketplace.',
        heroBody: 'Publish code, study notes, templates, prompts, design assets, media, and premium files in one place. EduBridge is designed to become the main bridge between useful information and the people who need it.',
        explore: 'Explore resources',
        upload: 'Start uploading',
        heroStats: ['published resources', 'downloads processed', 'image, video, and files'],
        why: 'Why EduBridge',
        whyTitle: 'A central bridge for useful information and digital value.',
        whyBody: 'The platform is designed for people who want to learn, share, publish, sell, and build trust around digital knowledge. It supports practical resources from many formats instead of limiting the experience to only one type of content.',
        experience: 'Resource experience',
        experienceTitle: 'Designed for multiple content types, not just one format.',
        contentFlow: 'Content flow',
        contentTitle: 'Upload, preview, discover, save, buy, and return.',
        contentBody: 'Each page should help users understand what the resource is, why it matters, and what they get.',
        future: 'Future capability',
        futureTitle: 'EduBridge can grow into the main information exchange layer.',
        futureBody: 'That means stronger creator identity, better discovery, richer previews, and a more scalable content ecosystem.',
        categories: 'Categories',
        categoriesTitle: 'Browse by what people actually need',
        categoriesDesc: 'Focused categories help users find practical resources quickly.',
        featured: 'Featured',
        featuredTitle: 'Featured resources',
        featuredDesc: 'Well-presented products with clear previews, strong positioning, and useful files.',
        trending: 'Trending',
        trendingTitle: 'Trending resources',
        trendingDesc: 'Popular downloads this week across code, study materials, templates, and assets.',
        free: 'Free',
        freeTitle: 'Free resources',
        freeDesc: 'Public downloads for learning, exploration, and everyday work.',
        paid: 'Paid',
        paidTitle: 'Paid resources',
        paidDesc: 'Premium digital products with more depth, structure, and ongoing value.',
        creator: 'Creator highlight',
        creatorTitle: 'Creator highlight',
        downloads: 'Downloads',
        rating: 'Rating',
        reviews: 'Reviews',
        creatorButton: 'View creator profile',
        how: 'How it works',
        howTitle: 'Simple for creators and useful for buyers',
        howDesc: 'The platform keeps the process straightforward from upload to download.',
        viewAll: 'View all',
        mediaSupport: 'Media support',
        mediaValue: 'Image, video, file',
        publishedResources: 'Published resources'
      };

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

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <HeroStat value="24K+" label={copy.heroStats[0]} />
              <HeroStat value="1.2M" label={copy.heroStats[1]} />
              <HeroStat value="3 formats" label={copy.heroStats[2]} />
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div className="hero-immersive hero-immersive-clean media-tilt rounded-md border border-white/10 bg-[#2d3250]/88 shadow-soft-premium">
              <div className="hero-scene-glow" />
              <div className="hero-spotlight" />
              <HeroModelViewer />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <MetricCard icon={Store} label={copy.publishedResources} value="24K+" />
              <MetricCard icon={Download} label={copy.downloads} value="1.2M" />
              <MetricCard icon={ImageIcon} label={copy.mediaSupport} value={copy.mediaValue} />
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
            {platformBlocks.map((item) => (
              <div key={item.title} className="surface-panel p-6">
                <h3 className="card-title text-white">{locale === 'mn' ? item.titleMn : item.title}</h3>
                <p className="meta-copy mt-3">{locale === 'mn' ? item.descriptionMn : item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          <div className="surface-panel mesh-accent overflow-hidden p-8">
            <p className="eyebrow-text">{copy.experience}</p>
            <h2 className="section-title mt-3 text-white">{copy.experienceTitle}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {mediaFormats.map((item) => (
                <div key={item.label} className="border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="card-title text-base text-white">{locale === 'mn' ? item.labelMn : item.label}</p>
                  <p className="meta-copy mt-2">{locale === 'mn' ? item.valueMn : item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-panel p-6">
              <p className="eyebrow-text">{copy.contentFlow}</p>
              <h3 className="card-title mt-3 text-white">{copy.contentTitle}</h3>
              <p className="meta-copy mt-3">{copy.contentBody}</p>
            </div>
            <div className="surface-dark rounded-md p-6 text-white">
              <p className="eyebrow-text">{copy.future}</p>
              <h3 className="card-title mt-3">{copy.futureTitle}</h3>
              <p className="meta-copy mt-3">{copy.futureBody}</p>
            </div>
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
      <ResourceSection eyebrow={copy.free} title={copy.freeTitle} description={copy.freeDesc} items={freeResources} viewAllLabel={copy.viewAll} />
      <ResourceSection eyebrow={copy.paid} title={copy.paidTitle} description={copy.paidDesc} items={paidResources} viewAllLabel={copy.viewAll} />

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

      <SectionBlock>
        <SectionHeading eyebrow={copy.how} title={copy.howTitle} description={copy.howDesc} />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {howItWorks.map((item, index) => (
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

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
      <Icon className="h-5 w-5 text-[#f9b17a]" />
      <p className="stat-number mt-6">{value}</p>
      <p className="mt-2 text-sm text-slate-200">{label}</p>
    </div>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="border border-white/15 bg-white/5 px-4 py-4 text-white backdrop-blur">
      <p className="stat-number text-[#f9b17a]">{value}</p>
      <p className="mt-1 text-sm text-slate-200">{label}</p>
    </div>
  );
}
