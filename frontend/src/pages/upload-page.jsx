import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { apiRequest } from '../lib/api';
import { fetchCategories } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function UploadPage() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { user, token, ready, isAuthenticated } = useAuth();

  const [status, setStatus] = useState({ type: '', message: '' });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [pricing, setPricing] = useState('free');
  const [busy, setBusy] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isPreview, setIsPreview] = useState(true);

  const copy = useMemo(
    () =>
      locale === 'mn'
        ? {
            eyebrow: 'Видео хичээл байршуулах',
            title: 'Курс болон эхний видео хичээлээ оруулах',
            body:
              'Бүтээгч эрхтэй хэрэглэгч курсийн мэдээллээ бүртгүүлж, видео файлаа backend storage-д байршуулна. Өгөгдлийн санд зөвхөн файлын URL хадгалагдана.',
            courseInfo: 'Курсийн мэдээлэл',
            mediaInfo: 'Видео хичээл',
            pricingInfo: 'Үнэ ба хандалт',
            titleField: 'Курсийн гарчиг',
            titlePlaceholder: 'Жишээ нь: React course, UI design bootcamp',
            lessonTitle: 'Хичээлийн гарчиг',
            lessonTitlePlaceholder: 'Эхний хичээлийн нэр',
            sectionTitle: 'Хэсгийн нэр',
            sectionTitlePlaceholder: 'Курсийн агуулга',
            category: 'Ангилал',
            description: 'Дэлгэрэнгүй тайлбар',
            descriptionPlaceholder:
              'Энэ курс юуг заах, хэнд зориулсан, ямар үр дүн өгөхийг тайлбарлана уу.',
            shortDescription: 'Товч тайлбар',
            shortDescriptionPlaceholder: 'Карт дээр харагдах богино тайлбар',
            language: 'Хэл',
            level: 'Түвшин',
            thumbnailUrl: 'Cover зургийн URL',
            thumbnailPlaceholder: 'https://...',
            videoLabel: 'Видео файл',
            videoHint: 'MP4, WebM, MOV зэрэг формат. Хамгийн ихдээ 500MB.',
            previewLabel: 'Нийтэд preview хэлбэрээр харуулах',
            previewHint:
              'Preview идэвхтэй бол энэ видео detail хуудсан дээр тоглогдоно.',
            pricing: 'Төрөл',
            price: 'Үнэ',
            publish: 'Видео хичээлтэй курс үүсгэх',
            loading: 'Ачаалж байна...',
            loginNeeded: 'Курс байршуулахын тулд эхлээд нэвтэрнэ үү.',
            instructorOnly:
              'Видео курс оруулахын тулд бүтээгч эрхтэй бүртгэл хэрэгтэй.',
            profileMissing:
              'Таны бүтээгчийн profile бүрэн болоогүй байна. Дахин нэвтэрч оролдоно уу.',
            success: 'Курс болон видео амжилттай байршлаа.',
            emptyCategories:
              'Ангилал олдсонгүй. Эхлээд category seed хийгээд дахин оролдоно уу.',
            categoryLoadFailed: 'Ангиллуудыг ачаалж чадсангүй.',
            selectVideo: 'Видео файлаа сонгоно уу.',
            invalidPaidPrice:
              'Хэрэв paid сонгосон бол 0-ээс их үнэ оруулна уу.',
            freeOption: 'Үнэгүй',
            paidOption: 'Төлбөртэй',
            beginner: 'Анхан',
            intermediate: 'Дунд',
            advanced: 'Ахисан',
            signIn: 'Нэвтрэх',
            createCreator: 'Бүтээгч эрх үүсгэх',
            previewOn: 'Идэвхтэй',
            previewOff: 'Идэвхгүй',
            languagePlaceholder: 'Монгол / English'
          }
        : {
            eyebrow: 'Video lesson upload',
            title: 'Create a course and upload its first video lesson',
            body:
              'This form creates the course, uploads the first lesson video to backend storage, and stores only the file URL in the database.',
            courseInfo: 'Course details',
            mediaInfo: 'Video lesson',
            pricingInfo: 'Pricing and access',
            titleField: 'Course title',
            titlePlaceholder: 'React course, UI design bootcamp, and so on',
            lessonTitle: 'Lesson title',
            lessonTitlePlaceholder: 'Title of the first lesson',
            sectionTitle: 'Section title',
            sectionTitlePlaceholder: 'Course content',
            category: 'Category',
            description: 'Description',
            descriptionPlaceholder:
              'Explain what the course teaches, who it is for, and what outcome learners can expect.',
            shortDescription: 'Short description',
            shortDescriptionPlaceholder:
              'Short preview text shown on cards',
            language: 'Language',
            level: 'Level',
            thumbnailUrl: 'Cover image URL',
            thumbnailPlaceholder: 'https://...',
            videoLabel: 'Video file',
            videoHint:
              'MP4, WebM, MOV, and similar formats. Max 500MB.',
            previewLabel: 'Allow public preview',
            previewHint:
              'When enabled, this video will be playable on the public detail page.',
            pricing: 'Pricing',
            price: 'Price',
            publish: 'Create course with video lesson',
            loading: 'Loading...',
            loginNeeded: 'Please sign in before uploading a course.',
            instructorOnly:
              'You need a creator account to publish video courses.',
            profileMissing:
              'Your creator profile is not ready yet. Please sign in again and try again.',
            success: 'The course and video were uploaded successfully.',
            emptyCategories:
              'No categories found. Seed the categories first and try again.',
            categoryLoadFailed: 'Unable to load categories.',
            selectVideo: 'Please select a video file.',
            invalidPaidPrice:
              'Paid courses require a price greater than 0.',
            freeOption: 'Free',
            paidOption: 'Paid',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            signIn: 'Sign in',
            createCreator: 'Create creator account',
            previewOn: 'ON',
            previewOff: 'OFF',
            languagePlaceholder: 'Mongolian / English'
          },
    [locale]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setCategoryError('');
        const categoryData = await fetchCategories();

        if (active) {
          setCategories(categoryData);
        }
      } catch (loadError) {
        if (active) {
          setCategoryError(loadError.message);
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    if (!videoFile) {
      setStatus({ type: 'error', message: copy.selectVideo });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const normalizedPrice =
      pricing === 'free' ? 0 : Number(formData.get('price') || 0);

    if (
      pricing === 'paid' &&
      (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0)
    ) {
      setStatus({ type: 'error', message: copy.invalidPaidPrice });
      return;
    }

    formData.set('price', String(normalizedPrice));
    formData.set('isPreview', String(isPreview));

    if (!formData.get('lessonTitle')) {
      formData.set(
        'lessonTitle',
        String(formData.get('title') || '').trim()
      );
    }

    if (!formData.get('sectionTitle')) {
      formData.set(
        'sectionTitle',
        locale === 'mn' ? 'Курсийн агуулга' : 'Course content'
      );
    }

    setBusy(true);
    setStatus({ type: '', message: '' });

    try {
      const resource = await apiRequest('/resources', {
        method: 'POST',
        token,
        body: formData
      });

      setStatus({ type: 'success', message: copy.success });
      event.currentTarget.reset();
      setVideoFile(null);
      setPricing('free');
      setIsPreview(true);

      if (resource?.slug) {
        navigate(`/resources/${resource.slug}`);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  if (!ready || loadingCategories) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">{copy.loading}</div>
      </main>
    );
  }

  if (categoryError) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.categoryLoadFailed}</h1>
          <p className="mt-4 text-slate-300">{categoryError}</p>
        </div>
      </main>
    );
  }

  if (!categories.length) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.emptyCategories}</h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loginNeeded}</h1>
          <Link
            to="/auth#signin"
            className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]"
          >
            {copy.signIn}
          </Link>
        </div>
      </main>
    );
  }

  if (user?.role !== 'INSTRUCTOR') {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.instructorOnly}</h1>
          <Link
            to="/auth#signup"
            className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]"
          >
            {copy.createCreator}
          </Link>
        </div>
      </main>
    );
  }

  if (!user?.instructorProfile) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.profileMissing}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent max-w-4xl p-8">
        <p className="eyebrow-text">{copy.eyebrow}</p>
        <h1 className="page-title mt-3 text-white">{copy.title}</h1>
        <p className="body-copy mt-4">{copy.body}</p>
      </div>

      <form className="mt-10 space-y-8" onSubmit={onSubmit}>
        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-2">
          <SectionHeading
            title={copy.courseInfo}
            className="lg:col-span-2"
          />

          <Field label={copy.titleField}>
            <input
              name="title"
              type="text"
              placeholder={copy.titlePlaceholder}
              className="input-base"
              required
            />
          </Field>

          <Field label={copy.category}>
            <select
              name="categoryId"
              className="select-base"
              defaultValue={categories[0]?.id}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={copy.lessonTitle}>
            <input
              name="lessonTitle"
              type="text"
              placeholder={copy.lessonTitlePlaceholder}
              className="input-base"
            />
          </Field>

          <Field label={copy.sectionTitle}>
            <input
              name="sectionTitle"
              type="text"
              placeholder={copy.sectionTitlePlaceholder}
              className="input-base"
            />
          </Field>

          <Field label={copy.description} className="lg:col-span-2">
            <textarea
              name="description"
              rows="6"
              placeholder={copy.descriptionPlaceholder}
              className="input-base"
              required
            />
          </Field>

          <Field label={copy.shortDescription}>
            <input
              name="shortDescription"
              type="text"
              placeholder={copy.shortDescriptionPlaceholder}
              className="input-base"
            />
          </Field>

          <Field label={copy.thumbnailUrl}>
            <input
              name="thumbnailUrl"
              type="url"
              placeholder={copy.thumbnailPlaceholder}
              className="input-base"
            />
          </Field>

          <Field label={copy.language}>
            <input
              name="language"
              type="text"
              placeholder={copy.languagePlaceholder}
              className="input-base"
            />
          </Field>

          <Field label={copy.level}>
            <select name="level" className="select-base" defaultValue="Beginner">
              <option value="Beginner">{copy.beginner}</option>
              <option value="Intermediate">{copy.intermediate}</option>
              <option value="Advanced">{copy.advanced}</option>
            </select>
          </Field>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-[1.2fr,0.8fr]">
          <SectionHeading
            title={copy.mediaInfo}
            className="lg:col-span-2"
          />

          <Field label={copy.videoLabel}>
            <UploadInput
              name="video"
              accept="video/*"
              hint={copy.videoHint}
              file={videoFile}
              onChange={(event) =>
                setVideoFile(event.target.files?.[0] || null)
              }
            />
          </Field>

          <label className="flex min-h-40 flex-col justify-between rounded-md border border-white/10 bg-white/5 p-5">
            <div>
              <span className="block text-sm font-medium text-slate-200">
                {copy.previewLabel}
              </span>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {copy.previewHint}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(event) => setIsPreview(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]"
              />
              <span className="text-sm text-slate-200">
                {isPreview ? copy.previewOn : copy.previewOff}
              </span>
            </div>
          </label>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-[1fr,1fr]">
          <SectionHeading
            title={copy.pricingInfo}
            className="lg:col-span-2"
          />

          <Field label={copy.pricing}>
            <select
              className="select-base"
              value={pricing}
              onChange={(event) => setPricing(event.target.value)}
            >
              <option value="free">{copy.freeOption}</option>
              <option value="paid">{copy.paidOption}</option>
            </select>
          </Field>

          <Field label={copy.price}>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              className="input-base"
              disabled={pricing === 'free'}
            />
          </Field>
        </section>

        {status.message ? (
          <p
            className={`rounded-md px-4 py-3 text-sm ${
              status.type === 'error'
                ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
                : 'border border-[#f9b17a]/30 bg-[#f9b17a]/10 text-[#ffd3af]'
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? copy.loading : copy.publish}
          </button>
        </div>
      </form>
    </main>
  );
}

function UploadInput({ name, accept, hint, file, onChange }) {
  return (
    <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 px-4 text-center text-sm text-slate-300">
      <span>{hint}</span>
      {file ? (
        <span className="mt-3 text-[#f9b17a]">
          {file.name} ({formatBytes(file.size)})
        </span>
      ) : null}
      <input
        name={name}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        required
      />
    </label>
  );
}

function SectionHeading({ title, className = '' }) {
  return <h2 className={`card-title text-white ${className}`}>{title}</h2>;
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}

function formatBytes(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / 1024 ** exponent;

  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${
    units[exponent]
  }`;
}