import { Download, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ResourceCard } from '../components/resource-card';
import { useAuth } from '../lib/auth';
import { apiRequest } from '../lib/api';
import {
  fetchResourceBySlug,
  fetchResources,
  getCategoryLabel,
  getLocalizedField
} from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function ResourceDetailPage() {
  const { locale } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [reviewStatus, setReviewStatus] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });

  const copy = useMemo(
    () =>
      locale === 'mn'
        ? {
            notFound: 'Хичээл олдсонгүй',
            notFoundBody: 'Таны хайсан хичээл одоогоор олдсонгүй.',
            backToExplore: 'Судлах хэсэг рүү буцах',
            pageLabel: 'Хичээлийн дэлгэрэнгүй',
            pageBody:
              'Энд preview видео, хичээлийн тайлбар, бүлэг болон хичээлийн жагсаалтыг нэг дороос харна.',
            rating: 'Үнэлгээ',
            downloads: 'Таталт',
            saved: 'Сэтгэгдэл',
            preview: 'Урьдчилж үзэх',
            previewUnavailable: 'Энэ хичээлд нийтэд нээлттэй preview видео алга.',
            creator: 'Бүтээгч',
            price: 'Үнэ',
            free: 'Үнэгүй',
            freeDownload: 'Үнэгүй хандалт',
            paidResource: 'Төлбөртэй хичээл',
            download: 'Хандах',
            buy: 'Худалдаж авах',
            saveForLater: 'Дараа үзэхээр хадгалах',
            reviews: 'Сэтгэгдлүүд',
            noReviews: 'Одоогоор сэтгэгдэл алга.',
            related: 'Төстэй хичээлүүд',
            moreIn: 'Бусад',
            loading: 'Хичээлийг ачаалж байна...',
            enrollSuccess: 'Хичээл амжилттай нэмэгдлээ.',
            saveHint: 'Хадгалах функц дараагийн алхамд backend-тэй холбогдоно.',
            courseContent: 'Хичээлийн агуулга',
            noLessons: 'Одоогоор хичээлийн жагсаалт алга.',
            previewBadge: 'Preview',
            lessons: 'Хичээл',
            duration: 'Үргэлжлэх хугацаа',
            ownerTools: 'Бүтээгчийн үйлдлүүд',
            deleteCourse: 'Хичээлийг устгах',
            deleteConfirm:
              'Энэ хичээлийг устгах уу? Видео файл болон хичээлийн мэдээлэл хамт устна.',
            deleting: 'Устгаж байна...',
            deleteSuccess: 'Хичээл устгагдлаа.',
            loadErrorTitle: 'Мэдээлэл ачаалж чадсангүй.',
            anonymousUser: 'EduBridge хэрэглэгч',
            noWrittenReview: 'Бичсэн сэтгэгдэл алга.',
            reviewTitle: 'Үнэлгээ өгөх',
            reviewBody:
              'Энэ хичээлийг үзсэн бол 1-5 одоор үнэлж, сэтгэгдлээ үлдээж болно.',
            yourRating: 'Таны үнэлгээ',
            reviewPlaceholder: 'Энэ хичээлээс юу сурсан эсвэл ямар санагдсан бэ?',
            submitReview: 'Үнэлгээ хадгалах',
            updatingReview: 'Хадгалж байна...',
            reviewSuccess: 'Үнэлгээ амжилттай хадгалагдлаа.',
            reviewLogin: 'Үнэлгээ өгөхийн тулд эхлээд нэвтэрнэ үү.',
            reviewMissing: '1-5 одны хооронд үнэлгээ сонгоно уу.',
            reviewAverage: 'Дундаж үнэлгээ',
            reviewCountSuffix: 'үнэлгээ',
            reviewRequirement:
              'Үнэлгээ өгөхийн тулд эхлээд тухайн хичээлд хандах хэрэгтэй.',
            ownerReviewBlocked: 'Өөрийн оруулсан хичээлийг өөрөө үнэлэх боломжгүй.'
          }
        : {
            notFound: 'Resource not found',
            notFoundBody: 'The resource you are looking for is not available.',
            backToExplore: 'Back to explore',
            pageLabel: 'Resource detail',
            pageBody:
              'See the preview video, course overview, section list, and lesson outline in one place.',
            rating: 'Rating',
            downloads: 'Downloads',
            saved: 'Reviews',
            preview: 'Preview',
            previewUnavailable:
              'This course does not have a public preview video yet.',
            creator: 'Creator',
            price: 'Price',
            free: 'Free',
            freeDownload: 'Free access',
            paidResource: 'Paid course',
            download: 'Get access',
            buy: 'Buy now',
            saveForLater: 'Save for later',
            reviews: 'Reviews',
            noReviews: 'No reviews yet.',
            related: 'Related resources',
            moreIn: 'More in',
            loading: 'Loading resource...',
            enrollSuccess: 'Resource added successfully.',
            saveHint: 'The save feature will be connected to the backend next.',
            courseContent: 'Course content',
            noLessons: 'No lessons have been added yet.',
            previewBadge: 'Preview',
            lessons: 'Lessons',
            duration: 'Duration',
            ownerTools: 'Creator actions',
            deleteCourse: 'Delete course',
            deleteConfirm:
              'Delete this course? The lesson video file and course content will be removed as well.',
            deleting: 'Deleting...',
            deleteSuccess: 'Course deleted.',
            loadErrorTitle: 'Unable to load data.',
            anonymousUser: 'EduBridge User',
            noWrittenReview: 'No written review.',
            reviewTitle: 'Leave a rating',
            reviewBody:
              'If you have gone through this course, you can rate it from 1 to 5 stars and leave a short comment.',
            yourRating: 'Your rating',
            reviewPlaceholder: 'What did you think about this course?',
            submitReview: 'Save rating',
            updatingReview: 'Saving...',
            reviewSuccess: 'Your rating has been saved.',
            reviewLogin: 'Please sign in before leaving a rating.',
            reviewMissing: 'Choose a rating between 1 and 5 stars.',
            reviewAverage: 'Average rating',
            reviewCountSuffix: 'ratings',
            reviewRequirement: 'You need course access before leaving a rating.',
            ownerReviewBlocked: 'You cannot rate your own course.'
          },
    [locale]
  );

  const isOwner = Boolean(
    resource && isAuthenticated && user?.id && resource.creator?.id === user.id
  );

  const existingReview = useMemo(
    () =>
      resource?.reviews?.find((review) => review.user?.id === user?.id) || null,
    [resource?.reviews, user?.id]
  );

  useEffect(() => {
    setReviewForm({
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || ''
    });
  }, [existingReview, resource?.id]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [current, allResources] = await Promise.all([
          fetchResourceBySlug(slug),
          fetchResources()
        ]);

        if (!active) {
          return;
        }

        setResource(current);
        setRelatedResources(
          allResources
            .filter(
              (item) => item.id !== current.id && item.category === current.category
            )
            .slice(0, 3)
        );
      } catch (loadError) {
        if (!active) {
          return;
        }

        if (loadError.message === 'Resource not found') {
          setResource(null);
          setRelatedResources([]);
        } else {
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
  }, [slug]);

  async function refreshCurrentResource() {
    if (!slug) {
      return;
    }

    const nextResource = await fetchResourceBySlug(slug);
    setResource(nextResource);
  }

  async function handleAcquire() {
    if (!resource) {
      return;
    }

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
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteCourse() {
    if (!resource || !isOwner) {
      return;
    }

    if (typeof window !== 'undefined' && !window.confirm(copy.deleteConfirm)) {
      return;
    }

    try {
      setDeleteBusy(true);
      setStatus({ type: '', message: '' });

      await apiRequest(`/instructor/courses/${resource.id}`, {
        method: 'DELETE',
        token
      });

      setStatus({ type: 'success', message: copy.deleteSuccess });
      navigate('/explore');
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!resource) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/auth#signin');
      return;
    }

    if (isOwner) {
      setReviewStatus({ type: 'error', message: copy.ownerReviewBlocked });
      return;
    }

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewStatus({ type: 'error', message: copy.reviewMissing });
      return;
    }

    try {
      setReviewBusy(true);
      setReviewStatus({ type: '', message: '' });

      await apiRequest('/student/reviews', {
        method: 'POST',
        token,
        body: {
          courseId: resource.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim()
        }
      });

      await refreshCurrentResource();
      setReviewStatus({ type: 'success', message: copy.reviewSuccess });
    } catch (requestError) {
      setReviewStatus({ type: 'error', message: requestError.message });
    } finally {
      setReviewBusy(false);
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

  if (error) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loadErrorTitle}</h1>
          <p className="mt-4 text-slate-300">{error}</p>
          <Link
            to="/explore"
            className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]"
          >
            {copy.backToExplore}
          </Link>
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
          <Link
            to="/explore"
            className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]"
          >
            {copy.backToExplore}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent mb-8 p-5 sm:p-8">
        <p className="eyebrow-text">{copy.pageLabel}</p>
        <h1 className="page-title mt-3 text-white">
          {getLocalizedField(resource, 'title', locale)}
        </h1>
        <p className="body-copy mt-4 max-w-3xl">{copy.pageBody}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.75fr]">
        <div className="space-y-8">
          <div className="surface-panel overflow-hidden">
            {resource.previewVideoUrl ? (
              <video
                controls
                preload="metadata"
                poster={resource.cover || undefined}
                src={resource.previewVideoUrl}
                className="h-full max-h-[240px] w-full bg-[#11162b] object-cover sm:max-h-[420px]"
              />
            ) : resource.cover ? (
              <img
                src={resource.cover}
                alt={getLocalizedField(resource, 'title', locale)}
                className="h-full max-h-[240px] w-full object-cover sm:max-h-[420px]"
              />
            ) : (
              <div className="flex h-[220px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,177,122,0.22),_transparent_45%),linear-gradient(135deg,_rgba(66,71,105,1),_rgba(35,40,68,1))] px-6 text-center text-sm text-slate-200 sm:h-[320px]">
                {getLocalizedField(resource, 'title', locale)}
              </div>
            )}
          </div>

          <div className="surface-panel p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium text-[#f9b17a]">
                {getCategoryLabel(resource.category, locale)}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-300">{resource.fileType}</span>
            </div>

            <h1 className="page-title mt-4 text-white">
              {getLocalizedField(resource, 'title', locale)}
            </h1>

            <p className="body-copy mt-5 max-w-3xl">
              {getLocalizedField(resource, 'description', locale)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-white/10 px-3 py-2 text-sm text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <MetaItem
                label={copy.rating}
                value={`${Number(resource.rating || 0).toFixed(1)} / 5`}
                icon={<Star className="h-4 w-4" />}
                helper={`${resource.reviewsCount || 0} ${copy.reviewCountSuffix}`}
              />
              <MetaItem
                label={copy.downloads}
                value={(resource.downloads || 0).toLocaleString()}
                icon={<Download className="h-4 w-4" />}
              />
              <MetaItem
                label={copy.saved}
                value={(resource.reviewsCount || 0).toLocaleString()}
                icon={<Heart className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="surface-panel p-5 sm:p-8">
            <h2 className="card-title text-white">{copy.preview}</h2>
            {resource.previewVideoUrl ? (
              <p className="meta-copy mt-4">
                {getLocalizedField(resource, 'preview', locale)}
              </p>
            ) : (
              <p className="meta-copy mt-4">{copy.previewUnavailable}</p>
            )}
          </div>

          <div className="surface-panel p-5 sm:p-8">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h2 className="card-title text-white">{copy.courseContent}</h2>
              <p className="text-sm text-slate-300">
                {resource.lessonCount} {copy.lessons.toLowerCase()}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {resource.sections.length > 0 ? (
                resource.sections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-md border border-white/10 p-4"
                  >
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <p className="text-sm font-medium text-white">
                        {section.title}
                      </p>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:text-xs sm:tracking-[0.28em]">
                        {section.lessons.length} {copy.lessons.toLowerCase()}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {section.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex flex-col items-start gap-3 rounded-md bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {index + 1}. {lesson.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {copy.duration}: {formatDuration(lesson.durationSeconds)}
                            </p>
                          </div>

                          {lesson.isPreview ? (
                            <span className="rounded-sm bg-[#f9b17a]/15 px-2.5 py-1 text-xs font-medium text-[#f9b17a]">
                              {copy.previewBadge}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-white/10 p-4 text-sm text-slate-300">
                  {copy.noLessons}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-panel p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-300">{copy.creator}</p>

            {resource.creator ? (
              <>
                <Link
                  to={`/creators/${resource.creator.slug}`}
                  className="mt-3 block text-lg font-semibold tracking-tight text-white transition hover:text-[#f9b17a]"
                >
                  {resource.creator.name}
                </Link>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {getLocalizedField(resource.creator, 'role', locale)}
                </p>
              </>
            ) : null}

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-sm text-slate-300">{copy.price}</p>
                  <p className="stat-number mt-1 text-white">
                    {resource.isFree ? copy.free : `$${resource.price}`}
                  </p>
                </div>

                <span
                  className={`rounded-sm px-2.5 py-1 text-xs font-medium ${
                    resource.isFree
                      ? 'bg-[#f9b17a]/20 text-[#f9b17a]'
                      : 'bg-white/10 text-white'
                  }`}
                >
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
                  {resource.isFree ? (
                    <Download className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
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
                <p
                  className={`mt-4 rounded-md px-4 py-3 text-sm ${
                    status.type === 'error'
                      ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
                      : 'border border-[#f9b17a]/20 bg-[#f9b17a]/10 text-[#ffe0c5]'
                  }`}
                >
                  {status.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="surface-panel p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="card-title text-white">{copy.reviewTitle}</h2>
                <p className="meta-copy mt-3">{copy.reviewBody}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
                  {copy.reviewAverage}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {Number(resource.rating || 0).toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  {resource.reviewsCount || 0} {copy.reviewCountSuffix}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <StarSummary rating={resource.rating || 0} />
            </div>

            {isOwner ? (
              <p className="mt-5 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {copy.ownerReviewBlocked}
              </p>
            ) : (
              <form className="mt-6" onSubmit={handleReviewSubmit}>
                <label className="block">
                  <span className="mb-3 block text-sm font-medium text-slate-200">
                    {copy.yourRating}
                  </span>
                  <StarRatingInput
                    value={reviewForm.rating}
                    onChange={(rating) =>
                      setReviewForm((current) => ({
                        ...current,
                        rating
                      }))
                    }
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    {copy.reviews}
                  </span>
                  <textarea
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm((current) => ({
                        ...current,
                        comment: event.target.value
                      }))
                    }
                    placeholder={copy.reviewPlaceholder}
                    className="input-base"
                  />
                </label>

                {reviewStatus.message ? (
                  <p
                    className={`mt-4 rounded-md px-4 py-3 text-sm ${
                      reviewStatus.type === 'error'
                        ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
                        : 'border border-[#f9b17a]/20 bg-[#f9b17a]/10 text-[#ffe0c5]'
                    }`}
                  >
                    {reviewStatus.message}
                  </p>
                ) : null}

                {!isAuthenticated ? (
                  <p className="mt-4 text-sm text-slate-300">{copy.reviewLogin}</p>
                ) : null}

                <p className="mt-4 text-xs leading-6 text-slate-400">
                  {copy.reviewRequirement}
                </p>

                <button
                  type="submit"
                  disabled={reviewBusy}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {reviewBusy ? copy.updatingReview : copy.submitReview}
                </button>
              </form>
            )}
          </div>

          {isOwner ? (
            <div className="surface-panel p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-300">{copy.ownerTools}</p>
              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={deleteBusy}
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteBusy ? copy.deleting : copy.deleteCourse}
              </button>
            </div>
          ) : null}

          <div className="surface-panel p-5 sm:p-6">
            <h2 className="card-title text-white">{copy.reviews}</h2>
            <div className="mt-5 space-y-4">
              {resource.reviews.length > 0 ? (
                resource.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-md border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">
                        {review.user?.name || copy.anonymousUser}
                      </p>
                      <div className="inline-flex items-center gap-1 text-sm text-[#f9b17a]">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {review.comment || copy.noWrittenReview}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-white/10 p-4 text-sm text-slate-300">
                  {copy.noReviews}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="eyebrow-text">{copy.related}</p>
            <h2 className="section-title mt-2 text-white">
              {`${copy.moreIn} ${getCategoryLabel(resource.category, locale)}`}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedResources.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function MetaItem({ label, value, icon, helper = '' }) {
  return (
    <div className="rounded-md border border-white/10 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="stat-number mt-3 text-white">{value}</p>
      {helper ? <p className="mt-2 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
}

function StarSummary({ rating }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < Math.round(rating);
        return (
          <Star
            key={index}
            className={`h-5 w-5 ${
              active ? 'fill-[#f9b17a] text-[#f9b17a]' : 'text-slate-500'
            }`}
          />
        );
      })}
    </div>
  );
}

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1;
        const active = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition ${
              active
                ? 'border-[#f9b17a] bg-[#f9b17a]/12 text-[#f9b17a]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-[#f9b17a]/60 hover:text-[#f9b17a]'
            }`}
          >
            <Star className={`h-5 w-5 ${active ? 'fill-current' : ''}`} />
          </button>
        );
      })}
    </div>
  );
}

function formatDuration(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0m';
  }

  const totalSeconds = Math.round(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}
