import { apiRequest } from './api';

export const categoryLabels = {
  'Web Development': { mn: 'Вэб хөгжүүлэлт', en: 'Web Development' },
  Design: { mn: 'Дизайн', en: 'Design' },
  Data: { mn: 'Өгөгдөл', en: 'Data' }
};

export const typeLabels = {
  Course: { mn: 'Нөөц', en: 'Resource' }
};

export const fallbackHowItWorks = [
  {
    title: 'Publish your resource',
    titleMn: 'Нөөцөө нийтлэх',
    description: 'Create a new resource, add clear details, and prepare it for discovery.',
    descriptionMn: 'Шинэ нөөц үүсгээд, ойлгомжтой мэдээлэл нэмэн, олддог болгоно.'
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
    shortDescription: 'A practical starter for internal tools and dashboard-style apps.',
    description: 'Includes a clean app shell, dashboard sections, authentication screens, and reusable layout patterns for real project work.',
    price: 24,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    preview: 'Built for practical product teams who want a clean starting point.',
    category: { id: 'cat-web', name: 'Web Development', slug: 'web-development' },
    creator: fallbackCreators[0],
    fileType: 'React • Beginner • 12 lessons',
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
    shortDescription: 'Ready-made empty states, labels, helper text, and UX copy blocks.',
    description: 'A structured collection of useful product copy for dashboards, onboarding flows, forms, and settings pages.',
    price: 0,
    isFree: true,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    preview: 'Useful for designers, product people, and frontend teams.',
    category: { id: 'cat-design', name: 'Design', slug: 'design' },
    creator: fallbackCreators[0],
    fileType: 'PDF • English • 4 lessons',
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
    shortDescription: 'Structured templates for notes, summaries, and insight collection.',
    description: 'Designed for students, analysts, and solo builders who need a consistent system for collecting and organizing useful information.',
    price: 12,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    preview: 'Clear, practical templates that reduce setup time.',
    category: { id: 'cat-data', name: 'Data', slug: 'data' },
    creator: fallbackCreators[1],
    fileType: 'PDF • Mongolian • 8 lessons',
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
    shortDescription: 'Core patterns for scalable UI systems and product design work.',
    description: 'Covers spacing, hierarchy, color usage, components, and practical system thinking for growing digital products.',
    price: 18,
    isFree: false,
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    preview: 'A useful starting point for smaller teams building a design system.',
    category: { id: 'cat-design', name: 'Design', slug: 'design' },
    creator: fallbackCreators[1],
    fileType: 'Figma • English • 10 lessons',
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
  const mapped = categoryLabels[category];
  return mapped ? mapped[locale] : category;
}

export function getTypeLabel(type, locale) {
  const mapped = typeLabels[type];
  return mapped ? mapped[locale] : type;
}

function normalizeCreator(creator) {
  return {
    ...creator,
    role: creator.expertise || creator.role || 'Creator',
    roleMn: creator.expertise || creator.role || 'Бүтээгч',
    bioMn: creator.bio,
    avatar: creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=232844&color=ffffff`,
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
