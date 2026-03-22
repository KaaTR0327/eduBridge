import { useLanguage } from '../lib/i18n';

export function AuthPage() {
  const { locale } = useLanguage();
  return (
    <main className="page-shell grid min-h-[calc(100vh-144px)] items-center px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="max-w-lg">
        <p className="eyebrow-text">{locale === 'mn' ? 'Эргэн тавтай морил' : 'Welcome back'}</p>
        <h1 className="page-title mt-3 text-white">
          {locale === 'mn' ? 'EduBridge-ийн бүтээгч ба мэдлэгийн орчинд нэвтрэх' : 'Sign in to access the EduBridge creator and knowledge ecosystem'}
        </h1>
        <p className="body-copy mt-4">
          {locale === 'mn' ? 'Өөрийн бүртгэлээр creator page удирдах, бүтээгдэхүүн нийтлэх, хадгалсан зүйлсээ хянах боломжтой.' : 'Use your account to manage creator pages, publish products, and track your saved items.'}
        </p>
      </div>

      <div className="surface-panel mt-10 p-8 lg:mt-0">
        <div className="grid gap-8 md:grid-cols-2">
          <form className="space-y-5">
            <h2 className="card-title text-white">{locale === 'mn' ? 'Нэвтрэх' : 'Login'}</h2>
            <Field label="Email">
              <input type="email" className="input-base" placeholder="you@example.com" />
            </Field>
            <Field label={locale === 'mn' ? 'Нууц үг' : 'Password'}>
              <input type="password" className="input-base" placeholder={locale === 'mn' ? 'Нууц үг' : 'Password'} />
            </Field>
            <button className="w-full rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
              {locale === 'mn' ? 'Нэвтрэх' : 'Sign in'}
            </button>
          </form>

          <form className="space-y-5 border-t border-slate-200 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <h2 className="card-title text-white">{locale === 'mn' ? 'Бүртгүүлэх' : 'Create account'}</h2>
            <Field label={locale === 'mn' ? 'Нэр' : 'Name'}>
              <input type="text" className="input-base" placeholder={locale === 'mn' ? 'Бүтэн нэр' : 'Full name'} />
            </Field>
            <Field label="Email">
              <input type="email" className="input-base" placeholder="you@example.com" />
            </Field>
            <Field label={locale === 'mn' ? 'Нууц үг' : 'Password'}>
              <input type="password" className="input-base" placeholder={locale === 'mn' ? 'Нууц үг үүсгэх' : 'Create a password'} />
            </Field>
            <button className="w-full rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
              {locale === 'mn' ? 'Бүртгэл үүсгэх' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}
