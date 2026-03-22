import { Globe, Link as LinkIcon, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ResourceCard } from '../components/resource-card';
import { getCreatorBySlug, getLocalizedField, getResourcesByCreator } from '../data/marketplace';
import { useLanguage } from '../lib/i18n';

export function CreatorProfilePage() {
  const { locale } = useLanguage();
  const { slug } = useParams();
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="page-title text-white">{locale === 'mn' ? 'Бүтээгч олдсонгүй' : 'Creator not found'}</h1>
      </main>
    );
  }

  const creatorResources = getResourcesByCreator(creator.id);

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent p-8">
        <div className="grid gap-8 lg:grid-cols-[160px,1fr]">
          <img src={creator.avatar} alt={creator.name} className="h-36 w-36 object-cover" />

          <div>
            <p className="eyebrow-text">{locale === 'mn' ? 'Бүтээгчийн хуудас' : 'Creator profile'}</p>
            <h1 className="page-title mt-3 text-white">{creator.name}</h1>
            <p className="mt-2 text-sm font-medium text-slate-300">{getLocalizedField(creator, 'role', locale)}</p>
            <p className="meta-copy mt-5 max-w-3xl">{getLocalizedField(creator, 'bio', locale)}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2"><DownloadCount total={creator.totalDownloads} locale={locale} /></span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#f9b17a] text-[#f9b17a]" /> <span className="stat-number text-white">{creator.rating}</span> {locale === 'mn' ? 'үнэлгээ' : 'rating'}</span>
              <span><span className="stat-number text-white">{creator.reviewCount}</span> {locale === 'mn' ? 'сэтгэгдэл' : 'reviews'}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><Globe className="h-4 w-4" /> {creator.socials.website}</span>
              <span className="inline-flex items-center gap-2 text-slate-200"><LinkIcon className="h-4 w-4" /> {creator.socials.x}</span>
              <span className="inline-flex items-center gap-2 text-slate-200"><LinkIcon className="h-4 w-4" /> {creator.socials.linkedin}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow-text">{locale === 'mn' ? 'Storefront' : 'Storefront'}</p>
            <h2 className="section-title mt-2 text-white">{locale === 'mn' ? 'Нийтэлсэн нөөцүүд' : 'Published resources'}</h2>
          </div>
          <p className="text-sm text-slate-500">{locale === 'mn' ? `${creatorResources.length} ширхэг` : `${creatorResources.length} items`}</p>
        </div>

        <div className="surface-dark mt-8 rounded-md px-6 py-5 text-white">
          <p className="eyebrow-text">{locale === 'mn' ? 'Бүтээгчийн storefront' : 'Creator storefront'}</p>
          <p className="meta-copy mt-2 max-w-3xl">
            {locale === 'mn' ? 'EduBridge-ийн бүтээгчийн хуудсууд нь итгэл, хэрэглээ, танигдах байдал, тогтвортой нийтлэл чухал байр суурьтай дижитал storefront хэлбэрээр бүтээгдсэн.' : 'EduBridge creator pages are designed as digital storefronts where trust, usefulness, identity, and consistent publishing all matter.'}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {creatorResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
      </section>
    </main>
  );
}

function DownloadCount({ total, locale }) {
  return <><span className="stat-number text-white">{total.toLocaleString()}</span> {locale === 'mn' ? 'таталт' : 'downloads'}</>;
}
