import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { HeroModelViewer } from '../components/hero-model-viewer';
import { ResourceCard } from '../components/resource-card';
import { SearchBar } from '../components/search-bar';
import { SectionHeading } from '../components/section-heading';
import { useAuth } from '../lib/auth';
import {
  fallbackHowItWorks,
  fetchCategories,
  fetchResources,
  getCategoryLabel,
  getLocalizedField
} from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function HomePage() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const canUpload = user?.role === 'INSTRUCTOR';

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [resourceData, categoryData] = await Promise.all([
          fetchResources(),
          fetchCategories()
        ]);

        if (active) {
          setResources(resourceData);
          setCategories(categoryData.map((item) => item.name));
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
  }, []);

  const featuredResources = useMemo(() => resources.slice(0, 4), [resources]);
  const trendingResources = useMemo(
    () => [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 4),
    [resources]
  );

  function handleHeroSearchSubmit(event) {
    event.preventDefault();
    const query = heroSearch.trim();
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore');
  }

  const copy =
    locale === 'mn'
      ? {
          eyebrow: 'Ирээдүйд бэлэн дижитал сургалтын платформ',
          heroTitle: 'EduBridge мэдлэгийг бодит дижитал marketplace болгоно.',
          heroBody:
            'Код, тэмдэглэл, загвар, сургалтын материал болон бүтээгчдийн хичээлийг нэг дороос нэгтгэж, олж, ашиглах боломжтой.',
          explore: 'Хичээл үзэх',
          upload: 'Хичээл нийтлэх',
          loading: 'Хуудсыг ачаалж байна...',
          why: 'Яагаад EduBridge',
          whyTitle:
            'Хэрэгтэй мэдлэг, багш, дижитал нөөцийг нэг дор холбосон төв орчин.',
          whyBody:
            'EduBridge нь багш нарт нийтлэх, хэрэглэгчдэд олох, байгууллагад хэрэгтэй материалаа дахин ашиглах боломж олгоно.',
          categories: 'Ангилал',
          categoriesTitle: 'Хүмүүс яг хэрэгтэй зүйлээрээ хайдаг',
          categoriesDesc:
            'Ангилал нь хэрэглэгчдэд хэрэгтэй хичээлээ илүү хурдан олоход тусална.',
          featured: 'Онцлох',
          featuredTitle: 'Онцлох хичээлүүд',
          featuredDesc: 'Шинэ, хэрэгтэй, бүтэцтэй хичээлүүд.',
          trending: 'Тренд',
          trendingTitle: 'Их анхаарал татаж буй хичээлүүд',
          trendingDesc:
            'Таталт болон хэрэглэгчийн сонирхлоор тэргүүлж буй нөөцүүд.',
          how: 'Хэрхэн ажилладаг',
          howTitle: 'Багш, хэрэглэгч хоёрт хоёуланд нь энгийн',
          howDesc:
            'Нийтлэхээс эхлээд олж авах хүртэлх урсгал ойлгомжтой байдаг.',
          viewAll: 'Бүгдийг үзэх',
          contact: {
            eyebrow: 'Холбоо барих',
            title: 'Асуулт, санал, хамтын ажил байвал шууд холбоо бариарай.',
            description:
              'EduBridge-ийн хичээл нийтлэх, багшийн эрх, техникийн тусламж эсвэл хамтын ажиллагааны талаар бидэнд бичиж болно.',
            name: 'Нэр',
            email: 'Имэйл',
            message: 'Зурвас',
            namePlaceholder: 'Таны нэр',
            emailPlaceholder: 'name@example.com',
            messagePlaceholder:
              'Яг юун дээр тусламж хэрэгтэй байгаагаа товч бичээрэй.',
            submit: 'Имэйл бичих',
            success: 'Имэйл програм нээгдлээ.',
            missing: 'Нэр, имэйл, зурвасаа бүрэн оруулна уу.',
            contactEmail: 'hello@edubridge.mn',
            contactPhone: '+976 7777 2040',
            contactAddress: 'Улаанбаатар, Монгол',
            emailTitle: 'Имэйл',
            phoneTitle: 'Утас',
            addressTitle: 'Хаяг',
            aboutTitle: 'Тухай',
            aboutBody:
              'EduBridge нь багш, суралцагч, дижитал агуулгыг нэг орчинд холбож олоход тусалдаг платформ.',
            termsTitle: 'Нөхцөл',
            termsBody:
              'Админаар батлагдсан хичээл л нийтэд харагдана, үнэлгээ нь зөвхөн оролцогч хэрэглэгчдэд зориулагдана.',
            privacyTitle: 'Нууцлал',
            privacyBody:
              'Бүртгэлийн мэдээлэл болон хичээлийн үйлдлийг зөвхөн платформын ажиллагаанд ашиглана.'
          }
        }
      : {
          eyebrow: 'Future-ready digital resource platform',
          heroTitle: 'EduBridge turns knowledge into a real digital marketplace.',
          heroBody:
            'Publish, discover, and use course content, notes, templates, and teaching resources from one focused ecosystem.',
          explore: 'Explore resources',
          upload: 'Publish resources',
          loading: 'Loading page...',
          why: 'Why EduBridge',
          whyTitle:
            'One focused place for useful knowledge, teachers, and digital resources.',
          whyBody:
            'EduBridge helps teachers publish, users discover, and teams return to the resources they actually use.',
          categories: 'Categories',
          categoriesTitle: 'Browse by what people actually need',
          categoriesDesc:
            'Categories help users find practical resources faster.',
          featured: 'Featured',
          featuredTitle: 'Featured resources',
          featuredDesc: 'Useful, recent, and structured resources.',
          trending: 'Trending',
          trendingTitle: 'Most active resources',
          trendingDesc: 'Popular resources based on engagement and usage.',
          how: 'How it works',
          howTitle: 'Simple for teachers and useful for learners.',
          howDesc: 'The flow stays clear from publishing to discovery.',
          viewAll: 'View all',
          contact: {
            eyebrow: 'Contact',
            title: 'Reach out for support, partnerships, or product questions.',
            description:
              'Use this section to contact EduBridge about publishing, teacher access, technical support, or collaboration.',
            name: 'Name',
            email: 'Email',
            message: 'Message',
            namePlaceholder: 'Your name',
            emailPlaceholder: 'name@example.com',
            messagePlaceholder: 'Tell us what you need help with.',
            submit: 'Send email',
            success: 'Your email app has been opened.',
            missing: 'Please fill in your name, email, and message.',
            contactEmail: 'hello@edubridge.mn',
            contactPhone: '+976 7777 2040',
            contactAddress: 'Ulaanbaatar, Mongolia',
            emailTitle: 'Email',
            phoneTitle: 'Phone',
            addressTitle: 'Address',
            aboutTitle: 'About',
            aboutBody:
              'EduBridge helps teachers, learners, and digital course content meet in one focused platform.',
            termsTitle: 'Terms',
            termsBody:
              'Only admin-approved courses are published, and ratings are intended for enrolled learners.',
            privacyTitle: 'Privacy',
            privacyBody:
              'Account details and course activity are used only for platform operations.'
          }
        };

  if (loading) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">{copy.loading}</div>
      </main>
    );
  }

  return (
    <main>
      <section className="hero-panel relative min-h-[calc(100vh-73px)] overflow-hidden border-b border-white/10">
        <div className="hero-overlay absolute inset-0" />
        <div className="grid-fade absolute inset-0 opacity-60" />

        <div className="page-shell relative flex min-h-[calc(100vh-73px)] flex-col justify-between gap-10 px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:grid lg:grid-cols-[0.94fr,1.06fr] lg:items-start lg:gap-12 lg:px-8 lg:pb-12 lg:pt-8">
          <div className="animate-rise max-w-2xl text-center lg:text-left">
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h1 className="hero-title mt-4 text-white">{copy.heroTitle}</h1>
            <p className="body-copy mx-auto mt-6 max-w-xl lg:mx-0">
              {copy.heroBody}
            </p>

            <form
              className="mx-auto mt-8 max-w-xl lg:mx-0"
              onSubmit={handleHeroSearchSubmit}
            >
              <SearchBar
                value={heroSearch}
                onChange={(event) => setHeroSearch(event.target.value)}
              />
            </form>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link
                to="/explore"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] sm:w-auto"
              >
                {copy.explore}
              </Link>
              {canUpload ? (
                <Link
                  to="/upload"
                  className="inline-flex w-full items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10 sm:w-auto"
                >
                  {copy.upload}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="animate-rise-delay relative lg:self-auto">
            <div className="hero-immersive hero-immersive-clean media-tilt rounded-md border border-white/10 bg-[#2d3250]/88 shadow-soft-premium">
              <div className="hero-scene-glow" />
              <div className="hero-spotlight" />
              <HeroModelViewer />
            </div>
          </div>
        </div>
      </section>

      <SectionBlock id="about">
        <div className="grid gap-6 lg:grid-cols-[0.88fr,1.12fr]">
          <div className="surface-dark rounded-md px-6 py-8 text-white sm:px-8 sm:py-10">
            <p className="eyebrow-text">{copy.why}</p>
            <h2 className="section-title mt-3">{copy.whyTitle}</h2>
            <p className="meta-copy mt-5 max-w-xl">{copy.whyBody}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              locale === 'mn'
                ? 'Нийтлэхэд бэлэн багшийн орчин'
                : 'Teacher-ready publishing flow',
              locale === 'mn'
                ? 'Ойлгомжтой хичээлийн preview'
                : 'Clear course previews',
              locale === 'mn'
                ? 'Нэг дор төвлөрсөн нөөцийн сан'
                : 'Focused resource library'
            ].map((item) => (
              <div key={item} className="surface-panel p-6">
                <h3 className="card-title text-white">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock>
        <SectionHeading
          eyebrow={copy.categories}
          title={copy.categoriesTitle}
          description={copy.categoriesDesc}
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/explore?category=${encodeURIComponent(category)}`}
              className="rounded-md border border-white/10 bg-[#424769] px-4 py-4 text-sm font-medium text-slate-200 transition hover:border-[#f9b17a] hover:text-[#f9b17a]"
            >
              {getCategoryLabel(category, locale)}
            </Link>
          ))}
        </div>
      </SectionBlock>

      <ResourceSection
        eyebrow={copy.featured}
        title={copy.featuredTitle}
        description={copy.featuredDesc}
        items={featuredResources}
        viewAllLabel={copy.viewAll}
      />

      <ResourceSection
        eyebrow={copy.trending}
        title={copy.trendingTitle}
        description={copy.trendingDesc}
        items={trendingResources}
        viewAllLabel={copy.viewAll}
      />

      <SectionBlock>
        <SectionHeading
          eyebrow={copy.how}
          title={copy.howTitle}
          description={copy.howDesc}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {fallbackHowItWorks.map((item, index) => (
            <div key={item.title} className="surface-panel p-6">
              <p className="text-sm font-medium text-slate-300">
                {locale === 'mn' ? `Алхам ${index + 1}` : `Step ${index + 1}`}
              </p>
              <h3 className="card-title mt-3 text-white">
                {getLocalizedField(item, 'title', locale)}
              </h3>
              <p className="meta-copy mt-3">
                {getLocalizedField(item, 'description', locale)}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <ContactSection copy={copy.contact} />
    </main>
  );
}

function SectionBlock({ children, id }) {
  return (
    <section id={id} className="page-shell px-4 py-14 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}

function ResourceSection({ eyebrow, title, description, items, viewAllLabel }) {
  return (
    <SectionBlock>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link
            to="/explore"
            className="text-sm font-medium text-slate-200 transition hover:text-[#f9b17a]"
          >
            {viewAllLabel}
          </Link>
        }
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </SectionBlock>
  );
}

function ContactSection({ copy }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus(copy.missing);
      return;
    }

    const subject = encodeURIComponent(`EduBridge contact from ${formState.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${formState.name.trim()}\nEmail: ${formState.email.trim()}\n\n${formState.message.trim()}`
    );

    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${copy.contactEmail}?subject=${subject}&body=${body}`;
    }

    setStatus(copy.success);
  }

  return (
    <section id="help" className="page-shell px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <div className="surface-panel grid gap-8 p-5 sm:p-8 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          <div>
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h2 className="section-title mt-3 text-white">{copy.title}</h2>
            <p className="meta-copy mt-4 max-w-2xl">{copy.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: copy.emailTitle,
                value: copy.contactEmail,
                href: `mailto:${copy.contactEmail}`
              },
              {
                title: copy.phoneTitle,
                value: copy.contactPhone,
                href: `tel:${copy.contactPhone.replace(/\s+/g, '')}`
              },
              {
                title: copy.addressTitle,
                value: copy.contactAddress,
                href: null
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
                  {item.title}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-3 block text-sm font-medium text-white transition hover:text-[#f9b17a]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-3 text-sm font-medium text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div id="terms" className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
                {copy.termsTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy.termsBody}</p>
            </div>
            <div
              id="privacy"
              className="rounded-md border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
                {copy.privacyTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy.privacyBody}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
                {copy.aboutTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy.aboutBody}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-white/10 bg-[#2d3250]/72 p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                {copy.name}
              </span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder={copy.namePlaceholder}
                className="input-base"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                {copy.email}
              </span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="input-base"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              {copy.message}
            </span>
            <textarea
              rows="7"
              value={formState.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder={copy.messagePlaceholder}
              className="input-base"
            />
          </label>

          {status ? (
            <p className="mt-4 rounded-md border border-[#f9b17a]/20 bg-[#f9b17a]/10 px-4 py-3 text-sm text-[#ffd5b1]">
              {status}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]"
          >
            {copy.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
