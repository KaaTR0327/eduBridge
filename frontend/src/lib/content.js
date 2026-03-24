import { apiRequest } from './api';

export const categoryLabels = {
  'Web Development': { mn: 'Вэб хөгжүүлэлт', en: 'Web Development' },
  Design: { mn: 'Дизайн', en: 'Design' },
  Data: { mn: 'Өгөгдөл', en: 'Data' }
};

export const typeLabels = {
  Course: { mn: 'Нөөц', en: 'Resource' }
};

export const languageLabels = {
  Mongolian: { mn: 'Монгол', en: 'Mongolian' },
  English: { mn: 'Англи', en: 'English' }
};

export const levelLabels = {
  Beginner: { mn: 'Анхан', en: 'Beginner' },
  Intermediate: { mn: 'Дунд', en: 'Intermediate' },
  Advanced: { mn: 'Ахисан', en: 'Advanced' }
};

export const fallbackHowItWorks = [
  {
    title: 'Publish your resource',
    titleMn: 'Нөөцөө нийтлэх',
    description: 'Create a new resource, add clear details, and prepare it for discovery.',
    descriptionMn: 'Шинэ нөөц үүсгээд, ойлгомжтой мэдээлэл нэмж, бусдад амархан олддог болгоно.'
  },
  {
    title: 'Make it discoverable',
    titleMn: 'Олддог болгох',
    description: 'Use useful titles, categories, and previews so the right people find it fast.',
    descriptionMn: 'Зөв хүмүүс хурдан олохын тулд гарчиг, ангилал, товч preview-гээ оновчтой тохируулна.'
  },
  {
    title: 'Turn interest into action',
    titleMn: 'Сонирхлыг үйлдэл болгох',
    description: 'Let visitors save, enroll, and return to the resources they need.',
    descriptionMn: 'Хэрэглэгчид хадгалах, авах, дахин ашиглах боломжтой байдлаар нөөцөө бэлдэнэ.'
  }
];

const fallbackCategories = [
  { id: 'cat-web', name: 'Web Development', slug: 'web-development' },
  { id: 'cat-design', name: 'Design', slug: 'design' },
  { id: 'cat-data', name: 'Data', slug: 'data' }
];

const fallbackCreators = [
  {
    id: 'creator-nomin',
    slug: 'nomin-erdene',
    name: 'Nomin Erdene',
    expertise: 'React, UI systems',
    bio: 'Publishes clean frontend starter kits and practical creator resources.',
    bioMn: 'Цэвэр frontend starter kit, хэрэгтэй бүтээгчийн нөөцүүдийг нийтэлдэг.',
    totalDownloads: 18420,
    rating: 4.9,
    reviewCount: 312
  },
  {
    id: 'creator-ariun',
    slug: 'ariun-data',
    name: 'Ariun Data',
    expertise: 'Data, research, analysis',
    bio: 'Creates structured templates, research packs, and learning material for students and small teams.',
    bioMn: 'Оюутан, жижиг багуудад зориулсан бүтэцтэй template, судалгааны багц, сургалтын материал бүтээдэг.',
    totalDownloads: 12600,
    rating: 4.8,
    reviewCount: 204
  }
];

const fallbackResources = [
  {
    id: 'resource-react-starter',
    slug: 'react-ui-starter-kit',
    title: 'React UI Starter Kit',
    titleMn: 'React UI эхлэлийн багц',
    shortDescription: 'A practical starter for internal tools and dashboard-style apps.',
    shortDescriptionMn: 'Дотоод хэрэгсэл болон dashboard төрлийн аппуудад зориулсан бодит эхлэлийн суурь.',
    description: 'Includes a clean app shell, dashboard sections, authentication screens, and reusable layout patterns for real project work.',
    descriptionMn: 'Цэвэр app shell, dashboard хэсгүүд, нэвтрэх дэлгэцүүд, дахин ашиглах боломжтой layout загваруудыг багтаасан.',
    price: 24,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    preview: 'Built for practical product teams who want a clean starting point.',
    previewMn: 'Цэвэр эхлэл хүсэж буй бодит бүтээгдэхүүний багуудад зориулсан.',
    category: { id: 'cat-web', name: 'Web Development', slug: 'web-development' },
    creator: fallbackCreators[0],
    tags: ['React', 'UI', 'Starter'],
    downloads: 2400,
    favorites: 684,
    rating: 4.9,
    reviewsCount: 52,
    lessonCount: 12,
    durationHours: 6.5,
    language: 'English',
    level: 'Beginner',
    status: 'APPROVED'
  },
  {
    id: 'resource-dashboard-copy',
    slug: 'dashboard-copy-library',
    title: 'Dashboard Copy Library',
    titleMn: 'Dashboard текстийн сан',
    shortDescription: 'Ready-made empty states, labels, helper text, and UX copy blocks.',
    shortDescriptionMn: 'Бэлэн empty state, label, helper text, UX copy-ийн блокууд.',
    description: 'A structured collection of useful product copy for dashboards, onboarding flows, forms, and settings pages.',
    descriptionMn: 'Dashboard, onboarding flow, form, settings хуудсуудад зориулсан хэрэгтэй product copy-ийн бүтэцтэй цуглуулга.',
    price: 0,
    isFree: true,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    preview: 'Useful for designers, product people, and frontend teams.',
    previewMn: 'Дизайнер, product баг, frontend багуудад хэрэгтэй.',
    category: { id: 'cat-design', name: 'Design', slug: 'design' },
    creator: fallbackCreators[0],
    tags: ['UX Writing', 'Design', 'Copy'],
    downloads: 7800,
    favorites: 1210,
    rating: 4.8,
    reviewsCount: 93,
    lessonCount: 4,
    durationHours: 2,
    language: 'English',
    level: 'Beginner',
    status: 'APPROVED'
  },
  {
    id: 'resource-research-pack',
    slug: 'research-template-pack',
    title: 'Research Template Pack',
    titleMn: 'Судалгааны template багц',
    shortDescription: 'Structured templates for notes, summaries, and insight collection.',
    shortDescriptionMn: 'Тэмдэглэл, хураангуй, insight цуглуулах бүтэцтэй template-үүд.',
    description: 'Designed for students, analysts, and solo builders who need a consistent system for collecting and organizing useful information.',
    descriptionMn: 'Хэрэгтэй мэдээллийг цуглуулж, цэгцлэх тогтвортой систем хэрэгтэй оюутан, шинжээч, solo builder нарт зориулсан.',
    price: 12,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    preview: 'Clear, practical templates that reduce setup time.',
    previewMn: 'Эхлүүлэх хугацааг багасгах ойлгомжтой, практик template-үүд.',
    category: { id: 'cat-data', name: 'Data', slug: 'data' },
    creator: fallbackCreators[1],
    tags: ['Research', 'Templates', 'Study'],
    downloads: 4200,
    favorites: 590,
    rating: 4.7,
    reviewsCount: 41,
    lessonCount: 8,
    durationHours: 3.2,
    language: 'Mongolian',
    level: 'Intermediate',
    status: 'APPROVED'
  },
  {
    id: 'resource-figma-system',
    slug: 'figma-system-foundations',
    title: 'Figma System Foundations',
    titleMn: 'Figma системийн үндэс',
    shortDescription: 'Core patterns for scalable UI systems and product design work.',
    shortDescriptionMn: 'Өргөтгөх боломжтой UI систем ба бүтээгдэхүүний дизайнд хэрэгтэй үндсэн загварууд.',
    description: 'Covers spacing, hierarchy, color usage, components, and practical system thinking for growing digital products.',
    descriptionMn: 'Spacing, hierarchy, өнгөний хэрэглээ, component, system thinking-ийн бодит хэрэглээг тайлбарлана.',
    price: 18,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    preview: 'A useful starting point for smaller teams building a design system.',
    previewMn: 'Design system эхлүүлж буй жижиг багуудад хэрэгтэй суурь эхлэл.',
    category: { id: 'cat-design', name: 'Design', slug: 'design' },
    creator: fallbackCreators[1],
    tags: ['Figma', 'Design System', 'UI'],
    downloads: 3100,
    favorites: 470,
    rating: 4.9,
    reviewsCount: 38,
    lessonCount: 10,
    durationHours: 5.1,
    language: 'English',
    level: 'Intermediate',
    status: 'APPROVED'
  }
];

export function getLocalizedField(item, key, locale) {
  if (locale === 'mn' && item?.[`${key}Mn`]) {
    return item[`${key}Mn`];
  }
  return item?.[key] || '';
}

export function getCategoryLabel(category, locale) {
  const categoryName = typeof category === 'string' ? category : category?.name;
  const mapped = categoryLabels[categoryName];
  return mapped ? mapped[locale] : categoryName || '';
}

export function getTypeLabel(type, locale) {
  const mapped = typeLabels[type];
  return mapped ? mapped[locale] : type;
}

export function getLanguageLabel(language, locale) {
  const mapped = languageLabels[language];
  return mapped ? mapped[locale] : language || '';
}

export function getLevelLabel(level, locale) {
  const mapped = levelLabels[level];
  return mapped ? mapped[locale] : level || '';
}

export function formatLessonCount(count, locale) {
  if (!count && count !== 0) {
    return '';
  }
  return locale === 'mn' ? `${count} хичээл` : `${count} lessons`;
}

export function formatResourceFileType(resource, locale) {
  const parts = [
    getLanguageLabel(resource.language, locale),
    getLevelLabel(resource.level, locale),
    formatLessonCount(resource.lessonCount, locale)
  ].filter(Boolean);

  return parts.join(' • ');
}

export function getLocalizedPriceOption(value, locale) {
  const labels = {
    free: { mn: 'Үнэгүй', en: 'Free' },
    paid: { mn: 'Төлбөртэй', en: 'Paid' }
  };

  return labels[value]?.[locale] || value;
}

function normalizeCreator(creator) {
  return {
    ...creator,
    role: creator.expertise || creator.role || 'Creator',
    roleMn: creator.roleMn || creator.expertise || 'Бүтээгч',
    bioMn: creator.bioMn || creator.bio,
    avatar: creator.avatar || creator.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=232844&color=ffffff`,
    socials: creator.socials || { website: '', x: '', linkedin: '' }
  };
}

function normalizeResource(resource) {
  return {
    ...resource,
    titleMn: resource.titleMn || resource.title,
    descriptionMn: resource.descriptionMn || resource.description,
    shortDescriptionMn: resource.shortDescriptionMn || resource.shortDescription,
    previewMn: resource.previewMn || resource.preview,
    type: resource.type || 'Course',
    category: resource.category?.name || resource.category,
    creatorId: resource.creator?.id,
    creator: resource.creator ? normalizeCreator(resource.creator) : null
  };
}

function getFallbackResources() {
  return fallbackResources.map(normalizeResource);
}

function getFallbackCreators() {
  return fallbackCreators.map(normalizeCreator);
}

export async function fetchCategories() {
  try {
    const categories = await apiRequest('/public/categories');
    return categories.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function fetchResources() {
  try {
    const resources = await apiRequest('/resources');
    return resources.map(normalizeResource);
  } catch {
    return getFallbackResources();
  }
}

export async function fetchResourceBySlug(slug) {
  try {
    const resource = await apiRequest(`/resources/${slug}`);
    return normalizeResource(resource);
  } catch {
    return getFallbackResources().find((item) => item.slug === slug) || null;
  }
}

export async function fetchCreators() {
  try {
    const creators = await apiRequest('/creators');
    return creators.map(normalizeCreator);
  } catch {
    return getFallbackCreators();
  }
}

export async function fetchCreatorBySlug(slug) {
  try {
    const creator = await apiRequest(`/creators/${slug}`);
    return normalizeCreator(creator);
  } catch {
    return getFallbackCreators().find((item) => item.slug === slug) || null;
  }
}

export async function fetchResourcesByCreator(creatorId) {
  const resources = await fetchResources();
  return resources.filter((item) => item.creatorId === creatorId);
}
