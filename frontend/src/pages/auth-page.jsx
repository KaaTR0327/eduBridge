import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeroModelViewer } from '../components/hero-model-viewer';
import { useAuth } from '../lib/auth';
import { useLanguage } from '../lib/i18n';

export function AuthPage() {
  const { locale } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, ready } = useAuth();
  const mode = location.hash === '#signup' ? 'signup' : 'signin';
  const [status, setStatus] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState('STUDENT');

  const copy = useMemo(() => (locale === 'mn'
    ? {
        eyebrow: 'EduBridge Access',
        title: 'Дижитал мэдлэг, нөөцөө нэг дор төвлөрүүл.',
        body: 'Нөөц, бүтээгчийн профайл, практик сургалтын материалыг нэг цэгээс удирдаж эхлээрэй.',
        signInTitle: 'Нэвтрэх',
        signInBody: 'Хадгалсан нөөц, сонгосон материал, ажлын орчноо үргэлжлүүлэн ашиглана.',
        signUpTitle: 'Бүртгэл үүсгэх',
        signUpBody: 'Шинэ бүртгэл нээгээд өөрийн нөөц, профайл, бүтээгчийн орчноо EduBridge дээр эхлүүлээрэй.',
        signIn: 'Нэвтрэх',
        signUp: 'Бүртгүүлэх',
        email: 'Имэйл',
        password: 'Нууц үг',
        name: 'Нэр',
        role: 'Бүртгэлийн төрөл',
        student: 'Суралцагч',
        instructor: 'Бүтээгч',
        switchToSignIn: 'Бүртгэлтэй юу? Нэвтрэх',
        switchToSignUp: 'Шинээр ашиглах бол бүртгүүлэх',
        createPassword: 'Нууц үг үүсгэх',
        remember: 'Намайг сана',
        forgot: 'Нууц үгээ мартсан уу?',
        loading: 'Түр хүлээнэ үү...',
        signInSuccess: 'Амжилттай нэвтэрлээ.',
        signUpSuccess: 'Бүртгэл амжилттай үүслээ.',
        alreadyIn: 'Та аль хэдийн нэвтэрсэн байна.',
        goHome: 'Нүүр хуудас руу буцах'
      }
    : {
        eyebrow: 'EduBridge Access',
        title: 'Bring your digital knowledge together.',
        body: 'Start managing resources, creator assets, and practical learning materials from one structured platform.',
        signInTitle: 'Sign in',
        signInBody: 'Continue to your saved resources, selected materials, and workspace.',
        signUpTitle: 'Create account',
        signUpBody: 'Open a new account and start publishing your files, resources, and creator profile on EduBridge.',
        signIn: 'Sign in',
        signUp: 'Sign up',
        email: 'Email',
        password: 'Password',
        name: 'Name',
        role: 'Account type',
        student: 'Student',
        instructor: 'Creator',
        switchToSignIn: 'Already have an account? Sign in',
        switchToSignUp: 'New here? Create an account',
        createPassword: 'Create a password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        loading: 'Please wait...',
        signInSuccess: 'Signed in successfully.',
        signUpSuccess: 'Account created successfully.',
        alreadyIn: 'You are already signed in.',
        goHome: 'Back to home'
      }), [locale]);

  if (ready && isAuthenticated) {
    return (
      <main className="page-shell flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="empty-state max-w-2xl">
          <h1 className="page-title text-white">{copy.alreadyIn}</h1>
          <Link to="/" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {copy.goHome}
          </Link>
        </div>
      </main>
    );
  }

  async function handleSignIn(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setStatus({ type: '', message: '' });

    try {
      await login(formData.get('email'), formData.get('password'));
      setStatus({ type: 'success', message: copy.signInSuccess });
      navigate('/explore');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setStatus({ type: '', message: '' });

    try {
      await register({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
      });
      setStatus({ type: 'success', message: copy.signUpSuccess });
      navigate('/explore');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#2f3455]/92 shadow-[0_32px_80px_rgba(6,8,22,0.38)] lg:grid-cols-[1.08fr,0.92fr]">
        <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,177,122,0.12),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(103,111,157,0.22),transparent_18%),linear-gradient(180deg,rgba(45,50,80,0.18),rgba(35,40,68,0.2))]" />
          <div className="relative z-10 flex h-full flex-col">
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-[420px] text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-[500px] text-sm leading-7 text-slate-200 sm:text-base">
              {copy.body}
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6">
              <div className="relative flex min-h-[320px] items-center justify-center lg:min-h-[380px]">
                <div className="relative h-[260px] w-full max-w-[360px] lg:h-[320px] lg:max-w-[420px]">
                  <HeroModelViewer />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="w-full">
            <div className="mb-8 inline-flex rounded-full border border-white/10 bg-[#232844]/80 p-1">
              <Link
                to="/auth#signin"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'signin' ? 'bg-[#f9b17a] text-[#232844]' : 'text-slate-300 hover:text-white'}`}
              >
                {copy.signIn}
              </Link>
              <Link
                to="/auth#signup"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'signup' ? 'bg-[#f9b17a] text-[#232844]' : 'text-slate-300 hover:text-white'}`}
              >
                {copy.signUp}
              </Link>
            </div>

            {mode === 'signin' ? (
              <form id="signin" className="space-y-6" onSubmit={handleSignIn}>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.signInTitle}</h2>
                  <p className="max-w-[420px] text-sm leading-7 text-slate-300">{copy.signInBody}</p>
                </div>

                <Field label={copy.email}>
                  <input name="email" type="email" className="input-base rounded-xl border-white/10 bg-white/[0.04]" placeholder="you@example.com" required />
                </Field>

                <Field label={copy.password}>
                  <input name="password" type="password" className="input-base rounded-xl border-white/10 bg-white/[0.04]" placeholder={copy.password} required minLength={6} />
                </Field>

                <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent text-[#f9b17a] focus:ring-[#f9b17a]" />
                    <span>{copy.remember}</span>
                  </label>
                  <span className="text-slate-400">{copy.forgot}</span>
                </div>

                <button disabled={busy} type="submit" className="w-full rounded-xl bg-[#f9b17a] px-5 py-3.5 text-sm font-semibold text-[#232844] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70">
                  {busy ? copy.loading : copy.signIn}
                </button>

                <StatusMessage status={status} />

                <p className="text-sm text-slate-300">
                  <Link to="/auth#signup" className="font-medium text-[#f9b17a] transition hover:text-[#f6a56b]">
                    {copy.switchToSignUp}
                  </Link>
                </p>
              </form>
            ) : (
              <form id="signup" className="space-y-6" onSubmit={handleSignUp}>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.signUpTitle}</h2>
                  <p className="max-w-[420px] text-sm leading-7 text-slate-300">{copy.signUpBody}</p>
                </div>

                <Field label={copy.name}>
                  <input name="fullName" type="text" className="input-base rounded-xl border-white/10 bg-white/[0.04]" placeholder="John Doe" required />
                </Field>

                <Field label={copy.email}>
                  <input name="email" type="email" className="input-base rounded-xl border-white/10 bg-white/[0.04]" placeholder="you@example.com" required />
                </Field>

                <Field label={copy.password}>
                  <input name="password" type="password" className="input-base rounded-xl border-white/10 bg-white/[0.04]" placeholder={copy.createPassword} required minLength={6} />
                </Field>

                <Field label={copy.role}>
                  <select
                    name="role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="select-base rounded-xl"
                  >
                    <option value="STUDENT">{copy.student}</option>
                    <option value="INSTRUCTOR">{copy.instructor}</option>
                  </select>
                </Field>

                <button disabled={busy} type="submit" className="w-full rounded-xl bg-[#f9b17a] px-5 py-3.5 text-sm font-semibold text-[#232844] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70">
                  {busy ? copy.loading : copy.signUp}
                </button>

                <StatusMessage status={status} />

                <p className="text-sm text-slate-300">
                  <Link to="/auth#signin" className="font-medium text-[#f9b17a] transition hover:text-[#f6a56b]">
                    {copy.switchToSignIn}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      {children}
    </label>
  );
}

function StatusMessage({ status }) {
  if (!status.message) return null;

  return (
    <p
      role="status"
      className={`rounded-xl px-4 py-3 text-sm ${
        status.type === 'error'
          ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
          : 'border border-[#f9b17a]/20 bg-[#f9b17a]/10 text-[#ffe0c5]'
      }`}
    >
      {status.message}
    </p>
  );
}
