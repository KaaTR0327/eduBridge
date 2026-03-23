import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { apiRequest } from '../lib/api';
import { fetchCategories } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function UploadPage() {
  const { locale } = useLanguage();
  const { user, token, ready, isAuthenticated } = useAuth();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [pricing, setPricing] = useState('free');
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState({ resource: '', preview: '' });

  const copy = useMemo(() => (locale === 'mn'
    ? {
        eyebrow: 'Нөөц оруулах',
        title: 'EduBridge орчинд хэрэгтэй нөөцөө нийтлэх',
        body: 'Backend нь одоо resource төвтэй API layer-тай болсон. Category, title, description, cover, price нь бодитоор хадгалагдана.',
        titleField: 'Гарчиг',
        titlePlaceholder: 'Жишээ нь: Clean dashboard starter kit',
        category: 'Ангилал',
        description: 'Тайлбар',
        descriptionPlaceholder: 'Юу багтсан, хэнд зориулагдсан, яагаад хэрэгтэйг тайлбарла.',
        shortDescription: 'Товч тайлбар',
        shortDescriptionPlaceholder: 'Карт дээр харагдах богино тайлбар',
        fileType: 'Төрөл',
        thumbnailUrl: 'Cover зураг URL',
        pricing: 'Үнийн төрөл',
        price: 'Үнэ',
        publish: 'Нөөц үүсгэх',
        loading: 'Ачаалж байна...',
        loginNeeded: 'Нөөц оруулахын тулд эхлээд нэвтэрнэ үү.',
        instructorOnly: 'Нөөц оруулахын тулд бүтээгч эрхтэй account хэрэгтэй.',
        pendingApproval: 'Таны creator profile approve хийгдээгүй байна. Resource нийтлэхийн тулд approve шаардлагатай.',
        success: 'Нөөц backend дээр амжилттай үүслээ.',
        fileNote: 'Одоогийн backend file upload дэмжихгүй байгаа тул сонгосон file name-ийг зөвхөн local preview болгож харуулж байна.'
      }
    : {
        eyebrow: 'Upload resource',
        title: 'Publish a useful resource into EduBridge',
        body: 'The backend now exposes a resource-centered API. Category, title, description, cover, and pricing are stored for real.',
        titleField: 'Title',
        titlePlaceholder: 'e.g. Clean dashboard starter kit',
        category: 'Category',
        description: 'Description',
        descriptionPlaceholder: 'Describe what is included, who it is for, and why it is useful.',
        shortDescription: 'Short description',
        shortDescriptionPlaceholder: 'Short preview text for cards',
        fileType: 'Type',
        thumbnailUrl: 'Cover image URL',
        pricing: 'Pricing',
        price: 'Price',
        publish: 'Create resource',
        loading: 'Loading...',
        loginNeeded: 'Please sign in before uploading a resource.',
        instructorOnly: 'You need a creator account to publish resources.',
        pendingApproval: 'Your creator profile is not approved yet. Publishing requires approval first.',
        success: 'Resource created successfully on the backend.',
        fileNote: 'The backend does not support file upload yet, so selected filenames are shown only as local previews.'
      }), [locale]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const categoryData = await fetchCategories();
        if (active) {
          setCategories(categoryData);
        }
      } finally {
        if (active) setLoadingCategories(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setStatus({ type: '', message: '' });

    try {
      await apiRequest('/resources', {
        method: 'POST',
        token,
        body: {
          categoryId: formData.get('categoryId'),
          title: formData.get('title'),
          shortDescription: formData.get('shortDescription'),
          description: formData.get('description'),
          price: pricing === 'free' ? 0 : Number(formData.get('price') || 0),
          thumbnailUrl: formData.get('thumbnailUrl'),
          language: formData.get('fileType'),
          level: 'Beginner'
        }
      });
      setStatus({ type: 'success', message: copy.success });
      event.currentTarget.reset();
      setFiles({ resource: '', preview: '' });
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

  if (!isAuthenticated) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loginNeeded}</h1>
          <Link to="/auth#signin" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {locale === 'mn' ? 'Нэвтрэх' : 'Sign in'}
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
          <Link to="/auth#signup" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {locale === 'mn' ? 'Creator бүртгэл үүсгэх' : 'Create creator account'}
          </Link>
        </div>
      </main>
    );
  }

  if (user?.instructorProfile?.verificationStatus !== 'APPROVED') {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.pendingApproval}</h1>
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
          <Field label={copy.titleField}>
            <input name="title" type="text" placeholder={copy.titlePlaceholder} className="input-base" required />
          </Field>

          <Field label={copy.category}>
            <select name="categoryId" className="select-base" defaultValue={categories[0]?.id}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>

          <Field label={copy.description} className="lg:col-span-2">
            <textarea name="description" rows="6" placeholder={copy.descriptionPlaceholder} className="input-base" required />
          </Field>

          <Field label={copy.shortDescription}>
            <input name="shortDescription" type="text" placeholder={copy.shortDescriptionPlaceholder} className="input-base" />
          </Field>

          <Field label={copy.fileType}>
            <input name="fileType" type="text" placeholder="Mongolian, English, Beginner" className="input-base" />
          </Field>

          <Field label={copy.thumbnailUrl} className="lg:col-span-2">
            <input name="thumbnailUrl" type="url" placeholder="https://..." className="input-base" />
          </Field>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-2">
          <Field label="Resource file">
            <UploadInput
              label={copy.fileNote}
              filename={files.resource}
              onChange={(event) => setFiles((current) => ({ ...current, resource: event.target.files?.[0]?.name || '' }))}
            />
          </Field>

          <Field label="Preview file">
            <UploadInput
              label={copy.fileNote}
              filename={files.preview}
              onChange={(event) => setFiles((current) => ({ ...current, preview: event.target.files?.[0]?.name || '' }))}
            />
          </Field>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-[1fr,1fr]">
          <Field label={copy.pricing}>
            <select className="select-base" value={pricing} onChange={(event) => setPricing(event.target.value)}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </Field>

          <Field label={copy.price}>
            <input name="price" type="number" min="0" placeholder="0" className="input-base" disabled={pricing === 'free'} />
          </Field>
        </section>

        {status.message ? (
          <p className={`rounded-md px-4 py-3 text-sm ${status.type === 'error' ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100' : 'border border-[#f9b17a]/30 bg-[#f9b17a]/10 text-[#ffd3af]'}`}>
            {status.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={busy} className="rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70">
            {busy ? copy.loading : copy.publish}
          </button>
        </div>
      </form>
    </main>
  );
}

function UploadInput({ label, filename, onChange }) {
  return (
    <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 px-4 text-center text-sm text-slate-300">
      <span>{label}</span>
      {filename ? <span className="mt-3 text-[#f9b17a]">{filename}</span> : null}
      <input type="file" onChange={onChange} className="hidden" />
    </label>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}
