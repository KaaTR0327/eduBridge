import { Globe, Link as LinkIcon, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResourceCard } from '../components/resource-card';
import { fetchCreatorBySlug, fetchResourcesByCreator, getLocalizedField } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function CreatorProfilePage() {
  const { locale } = useLanguage();
  const { slug } = useParams();
  const [creator, setCreator] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const copy = locale === 'mn'
    ? {
        notFound: 'Бүтээгч олдсонгүй',
        backToExplore: 'Судлах хуудас руу буцах',
        profile: 'Бүтээгчийн хуудас',
        downloads: 'таталт',
        rating: 'үнэлгээ',
        reviews: 'сэтгэгдэл',
        storefront: 'Storefront',
        published: 'Нийтэлсэн хичээлүүд',
        items: 'ширхэг',
        storefrontTitle: 'Бүтээгчийн storefront',
        storefrontBody: 'EduBridge-ийн бүтээгчийн хуудас нь итгэл, танигдах байдал, тогтвортой нийтлэлийг нэг дор харуулдаг төв цэг юм.',
        loading: 'Бүтээгчийн мэдээллийг ачаалж байна...'
      }
    : {
        notFound: 'Creator not found',
        backToExplore: 'Back to explore',
        profile: 'Creator profile',
        downloads: 'downloads',
        rating: 'rating',
        reviews: 'reviews',
        storefront: 'Storefront',
        published: 'Published resources',
        items: 'items',
        storefrontTitle: 'Creator storefront',
        storefrontBody: 'EduBridge creator pages are designed as focused storefronts where trust, usefulness, identity, and consistent publishing all matter.',
        loading: 'Loading creator profile...'
      };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const foundCreator = await fetchCreatorBySlug(slug);
        if (!active) return;
        setCreator(foundCreator);
        if (foundCreator) {
          setResources(await fetchResourcesByCreator(foundCreator.id));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loading}</h1>
        </div>
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.notFound}</h1>
          <Link to="/explore" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]">
            {copy.backToExplore}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent p-8">
        <div className="grid gap-8 lg:grid-cols-[160px,1fr]">
          <img src={creator.avatar} alt={creator.name} className="h-36 w-36 rounded-md object-cover" />

          <div>
            <p className="eyebrow-text">{copy.profile}</p>
            <h1 className="page-title mt-3 text-white">{creator.name}</h1>
            <p className="mt-2 text-sm font-medium text-slate-300">{getLocalizedField(creator, 'role', locale)}</p>
            <p className="meta-copy mt-5 max-w-3xl">{getLocalizedField(creator, 'bio', locale)}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2"><DownloadCount total={creator.totalDownloads} downloadsLabel={copy.downloads} /></span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#f9b17a] text-[#f9b17a]" /> <span className="stat-number text-white">{creator.rating}</span> {copy.rating}</span>
              <span><span className="stat-number text-white">{creator.reviewCount}</span> {copy.reviews}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {creator.socials.website ? <SocialLink href={creator.socials.website} icon={Globe} label={creator.socials.website.replace('https://', '')} /> : null}
              {creator.socials.x ? <SocialLink href={creator.socials.x} icon={LinkIcon} label={creator.socials.x.replace('https://x.com/', '@')} /> : null}
              {creator.socials.linkedin ? <SocialLink href={creator.socials.linkedin} icon={LinkIcon} label={creator.socials.linkedin.replace('https://', '')} /> : null}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow-text">{copy.storefront}</p>
            <h2 className="section-title mt-2 text-white">{copy.published}</h2>
          </div>
          <p className="text-sm text-slate-300">{`${resources.length} ${copy.items}`}</p>
        </div>

        <div className="surface-dark mt-8 rounded-md px-6 py-5 text-white">
          <p className="eyebrow-text">{copy.storefrontTitle}</p>
          <p className="meta-copy mt-2 max-w-3xl">{copy.storefrontBody}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
      </section>
    </main>
  );
}

function DownloadCount({ total, downloadsLabel }) {
  return <><span className="stat-number text-white">{total.toLocaleString()}</span> {downloadsLabel}</>;
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-200 transition hover:text-[#f9b17a]">
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
