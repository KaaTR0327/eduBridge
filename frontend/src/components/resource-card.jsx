import { ArrowUpRight, Download, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatResourceFileType, getLocalizedField, getTypeLabel } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function ResourceCard({ resource }) {
  const { locale } = useLanguage();
  const freeLabel = locale === 'mn' ? 'Үнэгүй' : 'Free';
  const viewLabel = locale === 'mn' ? 'Дэлгэрэнгүй' : 'View resource';

  return (
    <article className="overflow-hidden rounded-md border border-white/10 bg-[#424769] text-white shadow-soft-premium transition duration-200 hover:-translate-y-0.5 hover:border-[#f9b17a]/40">
      <Link to={`/resources/${resource.slug}`} className="group block h-full focus:outline-none">
        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
          {resource.cover ? (
            <img
              src={resource.cover}
              alt={getLocalizedField(resource, 'title', locale)}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,177,122,0.26),_transparent_40%),linear-gradient(135deg,_rgba(66,71,105,1),_rgba(35,40,68,1))] px-4 text-center text-sm font-medium text-slate-100">
              {getLocalizedField(resource, 'title', locale)}
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-slate-300">
            <span>{getTypeLabel(resource.type, locale)}</span>
            <span className={resource.isFree ? 'text-[#f9b17a]' : 'text-white'}>
              {resource.isFree ? freeLabel : `$${resource.price}`}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white transition group-hover:text-[#f9b17a]">
              {getLocalizedField(resource, 'title', locale)}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {getLocalizedField(resource, 'shortDescription', locale)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-sm bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-slate-300">
            <div>
              <p className="font-medium text-white">{resource.creator?.name || (locale === 'mn' ? 'EduBridge бүтээгч' : 'EduBridge Creator')}</p>
              <p>{formatResourceFileType(resource, locale)}</p>
            </div>

            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-1">
                <Star className="h-4 w-4 fill-[#f9b17a] text-[#f9b17a]" />
                <span className="tabular-nums">{resource.rating || 0}</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Download className="h-4 w-4" />
                <span className="tabular-nums">{(resource.downloads || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-[#f9b17a]">
            {viewLabel}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
