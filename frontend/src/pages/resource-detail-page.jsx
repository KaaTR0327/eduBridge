import { Download, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ResourceCard } from '../components/resource-card';
import { getCategoryLabel, getCreatorById, getLocalizedField, getResourceBySlug, resources } from '../data/marketplace';
import { useLanguage } from '../lib/i18n';

export function ResourceDetailPage() {
  const { locale } = useLanguage();
  const { slug } = useParams();
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="page-title text-white">{locale === 'mn' ? 'Нөөц олдсонгүй' : 'Resource not found'}</h1>
        <p className="mt-4 text-slate-300">{locale === 'mn' ? 'Таны хайж буй нөөц олдсонгүй.' : 'The resource you are looking for is not available.'}</p>
      </main>
    );
  }

  const creator = getCreatorById(resource.creatorId);
  const relatedResources = resources.filter((item) => item.id !== resource.id && item.category === resource.category).slice(0, 3);

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent mb-8 p-8">
        <p className="eyebrow-text">{locale === 'mn' ? 'Нөөцийн дэлгэрэнгүй' : 'Resource detail'}</p>
        <h1 className="page-title mt-3 text-white">{getLocalizedField(resource, 'title', locale)}</h1>
        <p className="body-copy mt-4 max-w-3xl">
          {locale === 'mn' ? 'Үнэ цэнэ, формат, бүтээгч, preview, дараагийн үйлдлийг ойлгоход зориулсан цэгцтэй хуудас.' : 'A clear product page for understanding the value, format, creator, preview, and next action.'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.75fr]">
        <div className="space-y-8">
          <div className="surface-panel overflow-hidden">
            <img src={resource.cover} alt={getLocalizedField(resource, 'title', locale)} className="h-full max-h-[420px] w-full object-cover" />
          </div>

          <div className="surface-panel p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium text-[#f9b17a]">{getCategoryLabel(resource.category, locale)}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-300">{resource.fileType}</span>
            </div>
            <h1 className="page-title mt-4 text-white">{getLocalizedField(resource, 'title', locale)}</h1>
            <p className="body-copy mt-5 max-w-3xl">{getLocalizedField(resource, 'description', locale)}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="rounded-sm bg-white/10 px-3 py-2 text-sm text-slate-200">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <MetaItem label={locale === 'mn' ? 'Үнэлгээ' : 'Rating'} value={resource.rating} icon={<Star className="h-4 w-4" />} />
              <MetaItem label={locale === 'mn' ? 'Таталт' : 'Downloads'} value={resource.downloads.toLocaleString()} icon={<Download className="h-4 w-4" />} />
              <MetaItem label={locale === 'mn' ? 'Хадгалсан' : 'Saved'} value={resource.favorites.toLocaleString()} icon={<Heart className="h-4 w-4" />} />
            </div>
          </div>

          <div className="surface-panel p-8">
            <h2 className="card-title text-white">Preview</h2>
            <p className="meta-copy mt-4">{getLocalizedField(resource, 'preview', locale)}</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-panel p-6">
            <p className="text-sm font-medium text-slate-300">{locale === 'mn' ? 'Бүтээгч' : 'Creator'}</p>
            <Link to={`/creators/${creator?.slug}`} className="mt-3 block text-lg font-semibold tracking-tight text-white transition hover:text-[#f9b17a]">
              {creator?.name}
            </Link>
            <p className="mt-2 text-sm leading-6 text-slate-200">{getLocalizedField(creator, 'role', locale)}</p>

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">{locale === 'mn' ? 'Үнэ' : 'Price'}</p>
                  <p className="stat-number mt-1 text-white">
                    {resource.isFree ? (locale === 'mn' ? 'Үнэгүй' : 'Free') : `$${resource.price}`}
                  </p>
                </div>
                <span className={`rounded-sm px-2.5 py-1 text-xs font-medium ${resource.isFree ? 'bg-[#f9b17a]/20 text-[#f9b17a]' : 'bg-white/10 text-white'}`}>
                  {resource.isFree ? (locale === 'mn' ? 'Үнэгүй татах' : 'Free download') : (locale === 'mn' ? 'Төлбөртэй нөөц' : 'Paid resource')}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
                  {resource.isFree ? <Download className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  {resource.isFree ? (locale === 'mn' ? 'Нөөц татах' : 'Download resource') : (locale === 'mn' ? 'Одоо худалдаж авах' : 'Buy now')}
                </button>
                <button className="w-full rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
                  {locale === 'mn' ? 'Дараа хадгалах' : 'Save for later'}
                </button>
              </div>
            </div>
          </div>

          <div className="surface-panel p-6">
            <h2 className="card-title text-white">{locale === 'mn' ? 'Сэтгэгдэл' : 'Reviews'}</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Lena Park', locale === 'mn' ? 'Файлууд нь цэгцтэй, preview дээрхтэйгээ яг адилхан байсан.' : 'Clear files, clean organization, and exactly what I expected from the preview.'],
                ['Jonas Reed', locale === 'mn' ? 'Хэрэглэхэд хялбар, бүтцийн хувьд маш ойлгомжтой нөөц байна.' : 'Useful resource with practical structure and easy-to-use files.']
              ].map(([name, review]) => (
                <div key={name} className="border border-white/10 p-4">
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{review}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow-text">{locale === 'mn' ? 'Төстэй нөөц' : 'Related resources'}</p>
            <h2 className="section-title mt-2 text-white">{locale === 'mn' ? `${getCategoryLabel(resource.category, locale)} төрлийн бусад` : `More in ${resource.category}`}</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedResources.map((item) => <ResourceCard key={item.id} resource={item} />)}
        </div>
      </section>
    </main>
  );
}

function MetaItem({ label, value, icon }) {
  return (
    <div className="border border-white/10 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="stat-number mt-3 text-white">{value}</p>
    </div>
  );
}
