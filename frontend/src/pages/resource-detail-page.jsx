import { Download, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ResourceCard } from '../components/resource-card';
import { useAuth } from '../lib/auth';
import { apiRequest } from '../lib/api';
import { fetchResourceBySlug, fetchResources, getCategoryLabel, getLocalizedField } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function ResourceDetailPage() {
  const { locale } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);

  const copy = useMemo(() => (locale === 'mn'
    ? {
        notFound: 'Нөөц олдсонгүй',
        notFoundBody: 'Таны хайж буй нөөц одоогоор байхгүй байна.',
        backToExplore: 'Судлах хуудас руу буцах',
        pageLabel: 'Нөөцийн дэлгэрэнгүй',
        pageBody: 'Үнэ цэнэ, бүтээгч, preview болон дараагийн алхмыг ойлгоход зориулсан дэлгэрэнгүй хуудас.',
        rating: 'Үнэлгээ',
        downloads: 'Таталт',
        saved: 'Сэтгэгдэл',
        preview: 'Товч агуулга',
        creator: 'Бүтээгч',
        price: 'Үнэ',
        free: 'Үнэгүй',
        freeDownload: 'Үнэгүй авах',
        paidResource: 'Төлбөртэй нөөц',
        download: 'Нөөц авах',
        buy: 'Одоо авах',
        saveForLater: 'Хадгалах',
        reviews: 'Сэтгэгдэл',
        related: 'Төстэй нөөц',
        moreIn: 'Бусад',
        loading: 'Нөөцийг ачаалж байна...',
        signInFirst: 'Үйлдэл хийхийн өмнө эхлээд нэвтэрнэ үү.',
        enrollSuccess: 'Нөөц амжилттай нэмэгдлээ.',
        saveHint: 'Хадгалах feature дараагийн алхамд backend дээр холбоно.'
      }
    : {
        notFound: 'Resource not found',
        notFoundBody: 'The resource you are looking for is not available.',
        backToExplore: 'Back to explore',
        pageLabel: 'Resource detail',
        pageBody: 'A clear product page for understanding the value, creator, preview, and next action.',
        rating: 'Rating',
        downloads: 'Downloads',
        saved: 'Reviews',
        preview: 'Preview',
        creator: 'Creator',
        price: 'Price',
        free: 'Free',
        freeDownload: 'Free access',
        paidResource: 'Paid resource',
        download: 'Get resource',
        buy: 'Buy now',
        saveForLater: 'Save for later',
        reviews: 'Reviews',
        related: 'Related resources',
        moreIn: 'More in',
        loading: 'Loading resource...',
        signInFirst: 'Please sign in before taking this action.',
        enrollSuccess: 'Resource added successfully.',
        saveHint: 'Save for later will be connected to backend next.'
      }), [locale]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [current, allResources] = await Promise.all([fetchResourceBySlug(slug), fetchResources()]);
        if (!active) return;
        setResource(current);
        if (current) {
          setRelatedResources(allResources.filter((item) => item.id !== current.id && item.category === current.category).slice(0, 3));
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

  async function handleAcquire() {
    if (!resource) return;
    if (!isAuthenticated) {
      navigate('/auth#signin');
      return;
    }

    try {
      setBusy(true);
      setStatus({ type: '', message: '' });
      await apiRequest(`/resources/${resource.id}/access`, {
        method: 'POST',
        token,
        body: {
          provider: 'EDUBRIDGE',
          paymentMethod: resource.isFree ? 'free' : 'demo'
        }
      });
      setStatus({ type: 'success', message: copy.enrollSuccess });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loading}</h1>
        </div>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.notFound}</h1>
          <p className="mt-4 text-slate-300">{copy.notFoundBody}</p>
          <Link to="/explore" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]">
            {copy.backToExplore}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent mb-8 p-8">
        <p className="eyebrow-text">{copy.pageLabel}</p>
        <h1 className="page-title mt-3 text-white">{getLocalizedField(resource, 'title', locale)}</h1>
        <p className="body-copy mt-4 max-w-3xl">{copy.pageBody}</p>
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
              <MetaItem label={copy.rating} value={resource.rating} icon={<Star className="h-4 w-4" />} />
              <MetaItem label={copy.downloads} value={(resource.downloads || 0).toLocaleString()} icon={<Download className="h-4 w-4" />} />
              <MetaItem label={copy.saved} value={(resource.favorites || 0).toLocaleString()} icon={<Heart className="h-4 w-4" />} />
            </div>
          </div>

          <div className="surface-panel p-8">
            <h2 className="card-title text-white">{copy.preview}</h2>
            <p className="meta-copy mt-4">{getLocalizedField(resource, 'preview', locale)}</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-panel p-6">
            <p className="text-sm font-medium text-slate-300">{copy.creator}</p>
            {resource.creator ? (
              <>
                <Link to={`/creators/${resource.creator.slug}`} className="mt-3 block text-lg font-semibold tracking-tight text-white transition hover:text-[#f9b17a]">
                  {resource.creator.name}
                </Link>
                <p className="mt-2 text-sm leading-6 text-slate-200">{getLocalizedField(resource.creator, 'role', locale)}</p>
              </>
            ) : null}

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">{copy.price}</p>
                  <p className="stat-number mt-1 text-white">{resource.isFree ? copy.free : `$${resource.price}`}</p>
                </div>
                <span className={`rounded-sm px-2.5 py-1 text-xs font-medium ${resource.isFree ? 'bg-[#f9b17a]/20 text-[#f9b17a]' : 'bg-white/10 text-white'}`}>
                  {resource.isFree ? copy.freeDownload : copy.paidResource}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleAcquire}
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {resource.isFree ? <Download className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  {busy ? '...' : resource.isFree ? copy.download : copy.buy}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus({ type: 'info', message: copy.saveHint })}
                  className="w-full rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]"
                >
                  {copy.saveForLater}
                </button>
              </div>

              {status.message ? (
                <p className={`mt-4 rounded-md px-4 py-3 text-sm ${status.type === 'error' ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100' : 'border border-[#f9b17a]/20 bg-[#f9b17a]/10 text-[#ffe0c5]'}`}>
                  {status.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="surface-panel p-6">
            <h2 className="card-title text-white">{copy.reviews}</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Lena Park', locale === 'mn' ? 'Файлууд нь цэгцтэй, preview дээрхтэйгээ яг адилхан байсан.' : 'Clear files, clean organization, and exactly what I expected from the preview.'],
                ['Jonas Reed', locale === 'mn' ? 'Хэрэглэхэд хялбар, бүтэц нь ойлгомжтой нөөц байна.' : 'Useful resource with practical structure and easy-to-use files.']
              ].map(([name, review]) => (
                <div key={name} className="rounded-md border border-white/10 p-4">
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
            <p className="eyebrow-text">{copy.related}</p>
            <h2 className="section-title mt-2 text-white">{`${copy.moreIn} ${getCategoryLabel(resource.category, locale)}`}</h2>
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
    <div className="rounded-md border border-white/10 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="stat-number mt-3 text-white">{value}</p>
    </div>
  );
}
