import { useLanguage } from '../lib/i18n';

export function UploadPage() {
  const { locale } = useLanguage();
  return (
    <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent max-w-4xl p-8">
        <p className="eyebrow-text">{locale === 'mn' ? 'Нөөц оруулах' : 'Upload resource'}</p>
        <h1 className="page-title mt-3 text-white">
          {locale === 'mn' ? 'EduBridge орчинд хэрэгтэй нөөцөө нийтлэх' : 'Publish a useful resource to the EduBridge ecosystem'}
        </h1>
        <p className="body-copy mt-4">
          {locale === 'mn' ? 'Энэ flow нь код, баримт, тэмдэглэл, материал, загвар, промпт болон бусад мэдлэгийн бүтээгдэхүүнд зориулагдсан.' : 'This flow is designed for code, documents, notes, assets, templates, prompts, and other knowledge products.'}
        </p>
      </div>

      <form className="mt-10 space-y-8">
        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-2">
          <Field label={locale === 'mn' ? 'Гарчиг' : 'Title'}>
            <input type="text" placeholder={locale === 'mn' ? 'Жишээ нь: Цэвэр dashboard starter kit' : 'e.g. Clean dashboard starter kit'} className="input-base" />
          </Field>

          <Field label={locale === 'mn' ? 'Ангилал' : 'Category'}>
            <select className="select-base">
              <option>Code</option>
              <option>Templates</option>
              <option>UI/UX</option>
              <option>Documents</option>
              <option>Study</option>
              <option>Prompts</option>
            </select>
          </Field>

          <Field label={locale === 'mn' ? 'Тайлбар' : 'Description'} className="lg:col-span-2">
            <textarea rows="6" placeholder={locale === 'mn' ? 'Юу багтсан, хэнд зориулагдсан, яагаад хэрэгтэйг тайлбарла.' : 'Describe what is included, who it is for, and what makes it useful.'} className="input-base" />
          </Field>

          <Field label="Tags">
            <input type="text" placeholder={locale === 'mn' ? 'React, dashboard, startup, боловсрол' : 'React, dashboard, startup, education'} className="input-base" />
          </Field>

          <Field label={locale === 'mn' ? 'Файлын төрөл' : 'File type'}>
            <input type="text" placeholder="ZIP, PDF, Figma, Notion" className="input-base" />
          </Field>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-2">
          <Field label={locale === 'mn' ? 'Файл оруулах' : 'Upload file'}>
            <label className="flex min-h-40 cursor-pointer items-center justify-center border border-dashed border-white/20 bg-white/5 text-sm text-slate-300">
              {locale === 'mn' ? 'Файл сонгох эсвэл чирж оруулах' : 'Choose file or drag and drop'}
              <input type="file" className="hidden" />
            </label>
          </Field>

          <Field label={locale === 'mn' ? 'Preview зураг' : 'Preview image'}>
            <label className="flex min-h-40 cursor-pointer items-center justify-center border border-dashed border-white/20 bg-white/5 text-sm text-slate-300">
              {locale === 'mn' ? 'Preview зураг оруулах' : 'Upload preview image'}
              <input type="file" className="hidden" />
            </label>
          </Field>
        </section>

        <section className="surface-panel grid gap-6 p-8 lg:grid-cols-[1fr,1fr,1fr]">
          <Field label={locale === 'mn' ? 'Үнийн төрөл' : 'Pricing'}>
            <select className="select-base">
              <option>Free</option>
              <option>Paid</option>
            </select>
          </Field>

          <Field label={locale === 'mn' ? 'Үнэ' : 'Price'}>
            <input type="number" placeholder="0" className="input-base" />
          </Field>

          <Field label={locale === 'mn' ? 'Харагдах төлөв' : 'Creator visibility'}>
            <select className="select-base">
              <option>Public</option>
              <option>Draft</option>
            </select>
          </Field>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
            {locale === 'mn' ? 'Нийтлэх' : 'Publish resource'}
          </button>
          <button type="button" className="rounded-md border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
            {locale === 'mn' ? 'Ноорог хадгалах' : 'Save draft'}
          </button>
        </div>
      </form>
    </main>
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
