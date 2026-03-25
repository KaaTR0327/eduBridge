import { apiRequest } from './api';

export const categoryLabels = {
  'Web Development': { mn: 'Вэб хөгжүүлэлт', en: 'Web Development' },
  Design: { mn: 'Дизайн', en: 'Design' },
  Data: { mn: 'Өгөгдөл', en: 'Data' }
};

export const typeLabels = {
  Course: { mn: 'Хичээл', en: 'Resource' }
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

export const howItWorksSteps = [
  {
    title: 'Publish your resource',
    titleMn: 'Хичээлээ нийтлэх',
    description: 'Create a new resource, add clear details, and prepare it for discovery.',
    descriptionMn: 'Шинэ хичээл үүсгээд, ойлгомжтой мэдээлэл нэмэн, олддог болгоно.'
  },
  {
    title: 'Make it discoverable',
    titleMn: 'Олддог болгох',
    description: 'Use useful titles, categories, and previews so the right people find it fast.',
    descriptionMn: 'Зөв хүмүүс хурдан олохын тулд гарчиг, ангилал, preview-гээ зөв тохируулна.'
  },
  {
    title: 'Turn interest into action',
    titleMn: 'Сонирхлыг үйлдэл болгох',
    description: 'Let visitors save, enroll, and return to the resources they need.',
    descriptionMn: 'Хэрэглэгчид хадгалах, авах, дахин ашиглах боломжтой болно.'
  }
];

export const fallbackHowItWorks = howItWorksSteps;

export function getLocalizedField(item, key, locale) {
  if (locale === 'mn' && item?.[`${key}Mn`]) {
    return item[`${key}Mn`];
  }
  return item?.[key] || '';
}

export function getCategoryLabel(category, locale) {
  const mapped = categoryLabels[category];
  return mapped ? mapped[locale] : category;
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
    roleMn: creator.expertise || creator.role || 'Бүтээгч',
    bioMn: creator.bio,
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
    cover: resource.cover || '',
    introVideoUrl: resource.introVideoUrl || '',
    previewVideoUrl: resource.previewVideoUrl || '',
    tags: Array.isArray(resource.tags) ? resource.tags : [],
    reviews: Array.isArray(resource.reviews) ? resource.reviews : [],
    sections: Array.isArray(resource.sections) ? resource.sections : [],
    creatorId: resource.creator?.id,
    creator: resource.creator ? normalizeCreator(resource.creator) : null
  };
}

export async function fetchCategories() {
  const categories = await apiRequest('/public/categories');
  return categories.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug
  }));
}

export async function fetchResources() {
  const resources = await apiRequest('/resources');
  return resources.map(normalizeResource);
}

export async function fetchResourceBySlug(slug) {
  const resource = await apiRequest(`/resources/${slug}`);
  return normalizeResource(resource);
}

export async function fetchCreators() {
  const creators = await apiRequest('/creators');
  return creators.map(normalizeCreator);
}

export async function fetchCreatorBySlug(slug) {
  const creator = await apiRequest(`/creators/${slug}`);
  return normalizeCreator(creator);
}

export async function fetchResourcesByCreator(creatorId) {
  const resources = await fetchResources();
  return resources.filter((item) => item.creatorId === creatorId);
}
