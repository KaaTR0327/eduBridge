export const categories = [
  'Code',
  'Templates',
  'UI/UX',
  'Images',
  'Documents',
  'Study',
  'Prompts',
  'Design Assets',
  'Business Files',
  'Productivity'
];

export const categoryLabels = {
  mn: {
    Code: 'Код',
    Templates: 'Загварууд',
    'UI/UX': 'UI/UX',
    Images: 'Зураг',
    Documents: 'Баримт',
    Study: 'Суралцах материал',
    Prompts: 'Промпт',
    'Design Assets': 'Дизайны материал',
    'Business Files': 'Бизнес файл',
    Productivity: 'Бүтээмж'
  },
  en: {}
};

export const typeLabels = {
  mn: {
    Code: 'Код',
    'UI Kit': 'UI багц',
    'Study Notes': 'Тэмдэглэл',
    Template: 'Загвар',
    Prompts: 'Промпт',
    'Design Assets': 'Дизайны материал',
    'Business Files': 'Бизнес файл',
    Documents: 'Баримт'
  },
  en: {}
};

export const creators = [
  {
    id: 'creator-maya-lin',
    slug: 'maya-lin',
    name: 'Maya Lin',
    role: 'Frontend engineer and product educator',
    roleMn: 'Фронтенд инженер, бүтээгдэхүүний сургагч',
    bio: 'Maya publishes clean React starter kits, UI systems, and practical setup guides for early-stage teams.',
    bioMn: 'Маяа эрт үеийн багуудад зориулсан цэгцтэй React starter kit, UI system, практик setup guide-ууд нийтэлдэг.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    socials: {
      website: 'mayalin.dev',
      x: '@mayalinbuilds',
      linkedin: 'linkedin.com/in/mayalin'
    },
    totalDownloads: 18420,
    rating: 4.9,
    reviewCount: 312
  },
  {
    id: 'creator-daniel-kim',
    slug: 'daniel-kim',
    name: 'Daniel Kim',
    role: 'Productivity systems creator',
    roleMn: 'Бүтээмжийн систем бүтээгч',
    bio: 'Daniel focuses on digital planners, knowledge products, and premium document packs for small teams and students.',
    bioMn: 'Даниел жижиг баг болон оюутнуудад зориулсан digital planner, мэдлэгийн бүтээгдэхүүн, premium document pack дээр төвлөрдөг.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    socials: {
      website: 'danielkim.co',
      x: '@danielkfiles',
      linkedin: 'linkedin.com/in/danielkim'
    },
    totalDownloads: 12600,
    rating: 4.8,
    reviewCount: 198
  },
  {
    id: 'creator-aila-ross',
    slug: 'aila-ross',
    name: 'Aila Ross',
    role: 'Visual designer and asset publisher',
    roleMn: 'Визуал дизайнер, материал нийтлэгч',
    bio: 'Aila shares neutral UI kits, design systems, and ready-to-use presentation assets for SaaS products.',
    bioMn: 'Айла SaaS бүтээгдэхүүнд зориулсан төвийг сахисан UI kit, design system, бэлэн presentation asset-ууд хуваалцдаг.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    socials: {
      website: 'ailaross.design',
      x: '@ailaross',
      linkedin: 'linkedin.com/in/ailaross'
    },
    totalDownloads: 21930,
    rating: 5,
    reviewCount: 426
  }
];

export const resources = [
  {
    id: 'res-shipkit-react',
    slug: 'shipkit-react-starter',
    title: 'ShipKit React Starter',
    titleMn: 'ShipKit React Эхлэл Багц',
    type: 'Code',
    category: 'Code',
    price: 39,
    isFree: false,
    creatorId: 'creator-maya-lin',
    description: 'A production-style React starter with authentication screens, dashboard shell, billing placeholders, and reusable layout patterns for client projects.',
    descriptionMn: 'Нэвтрэх дэлгэц, dashboard shell, billing хэсгийн placeholder, дахин ашиглах layout pattern-тай production хэв маягийн React starter.',
    shortDescription: 'A clean React starter for shipping internal tools and SaaS MVPs faster.',
    shortDescriptionMn: 'Internal tool болон SaaS MVP-ийг хурдан эхлүүлэх цэвэр React starter.',
    fileType: 'ZIP, JSX, MD',
    tags: ['React', 'Starter', 'Dashboard', 'Authentication'],
    downloads: 2400,
    favorites: 684,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    preview: 'Includes app shell, navigation, billing pages, and a neutral design system.',
    previewMn: 'App shell, navigation, billing page болон төвийг сахисан design system багтсан.'
  },
  {
    id: 'res-clean-ui-kit',
    slug: 'clean-ui-kit',
    title: 'Clean UI Kit for SaaS',
    titleMn: 'SaaS-д зориулсан Цэвэр UI Багц',
    type: 'UI Kit',
    category: 'UI/UX',
    price: 24,
    isFree: false,
    creatorId: 'creator-aila-ross',
    description: 'A restrained UI kit with forms, tables, dashboards, pricing sections, and marketing blocks designed for product teams building modern business apps.',
    descriptionMn: 'Орчин үеийн бизнес апп хийж буй багт зориулсан form, dashboard, pricing, marketing хэсэг бүхий цэгцтэй UI багц.',
    shortDescription: 'A calm UI kit with polished essentials for web product design.',
    shortDescriptionMn: 'Вэб бүтээгдэхүүний дизайн хийхэд хэрэгтэй үндсэн элементүүдтэй тайван UI багц.',
    fileType: 'Figma',
    tags: ['Figma', 'UI Kit', 'SaaS', 'Components'],
    downloads: 3870,
    favorites: 930,
    rating: 5,
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    preview: 'Contains buttons, forms, navigation, analytics, settings, and pricing patterns.',
    previewMn: 'Button, form, navigation, analytics, settings, pricing pattern-ууд агуулсан.'
  },
  {
    id: 'res-study-notes-ai',
    slug: 'applied-ai-study-notes',
    title: 'Applied AI Study Notes',
    titleMn: 'Хэрэглээний AI Тэмдэглэл',
    type: 'Study Notes',
    category: 'Study',
    price: 0,
    isFree: true,
    creatorId: 'creator-daniel-kim',
    description: 'A practical collection of AI implementation notes covering prompts, evaluation basics, lightweight automation workflows, and product use cases.',
    descriptionMn: 'Промпт, үнэлгээний суурь ойлголт, хөнгөн автоматжуулалт, бүтээгдэхүүний хэрэглээний жишээ хамарсан практик AI тэмдэглэл.',
    shortDescription: 'Structured notes for students and builders learning applied AI.',
    shortDescriptionMn: 'Хэрэглээний AI сурч буй оюутан, бүтээгчдэд зориулсан бүтэцтэй тэмдэглэл.',
    fileType: 'PDF',
    tags: ['AI', 'Study', 'Notes', 'Learning'],
    downloads: 11200,
    favorites: 1204,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    preview: 'Best for learners who want concise notes instead of long courses.',
    previewMn: 'Урт курс биш, товч бөгөөд хэрэгтэй тэмдэглэл хүсдэг хүмүүст хамгийн тохиромжтой.'
  },
  {
    id: 'res-template-landing',
    slug: 'minimal-landing-template',
    title: 'Minimal Landing Template',
    titleMn: 'Минимал Landing Загвар',
    type: 'Template',
    category: 'Templates',
    price: 18,
    isFree: false,
    creatorId: 'creator-maya-lin',
    description: 'A conversion-focused landing page template with hero, feature rows, pricing, FAQ, and contact sections in a neutral visual style.',
    descriptionMn: 'Hero, feature row, pricing, FAQ, contact хэсэгтэй conversion төвтэй landing page загвар.',
    shortDescription: 'A clean landing page template for small software products.',
    shortDescriptionMn: 'Жижиг software бүтээгдэхүүнд зориулсан цэвэр landing page загвар.',
    fileType: 'ZIP, HTML, CSS',
    tags: ['Landing Page', 'Template', 'Marketing', 'HTML'],
    downloads: 5310,
    favorites: 972,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    preview: 'Designed for startups that need clarity over decoration.',
    previewMn: 'Хэт чимэглэл бус, ойлгомжтой бүтэц шаарддаг startup-д зориулан хийсэн.'
  },
  {
    id: 'res-prompt-pack',
    slug: 'research-prompt-pack',
    title: 'Research Prompt Pack',
    titleMn: 'Судалгааны Промпт Багц',
    type: 'Prompts',
    category: 'Prompts',
    price: 12,
    isFree: false,
    creatorId: 'creator-daniel-kim',
    description: 'A prompt pack for research, synthesis, note organization, and insight extraction aimed at students, analysts, and solo founders.',
    descriptionMn: 'Судалгаа, нэгтгэл, тэмдэглэл цэгцлэх, insight гаргахад зориулсан промптын багц.',
    shortDescription: 'Useful prompts for research-heavy workflows and documentation.',
    shortDescriptionMn: 'Судалгаа их шаарддаг ажил болон documentation-д хэрэгтэй промптууд.',
    fileType: 'PDF, DOCX',
    tags: ['Prompts', 'Research', 'Writing', 'Knowledge Work'],
    downloads: 2860,
    favorites: 462,
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    preview: 'Organized by task type, from research summaries to structured writing.',
    previewMn: 'Судалгааны хураангуйгаас бүтэцтэй бичвэр хүртэл task төрөл бүрээр ангилсан.'
  },
  {
    id: 'res-brand-assets',
    slug: 'neutral-brand-asset-pack',
    title: 'Neutral Brand Asset Pack',
    titleMn: 'Төвийг Сахисан Брэнд Материалын Багц',
    type: 'Design Assets',
    category: 'Design Assets',
    price: 29,
    isFree: false,
    creatorId: 'creator-aila-ross',
    description: 'A set of icons, abstract backgrounds, simple illustrations, and presentation visuals designed for product launches and internal decks.',
    descriptionMn: 'Бүтээгдэхүүн launch болон дотоод танилцуулгад зориулсан icon, abstract background, illustration, presentation visual-уудын багц.',
    shortDescription: 'A premium pack of visual assets for product teams and consultants.',
    shortDescriptionMn: 'Бүтээгдэхүүний баг болон зөвлөхүүдэд зориулсан premium визуал материалын багц.',
    fileType: 'SVG, PNG, PDF',
    tags: ['Assets', 'Branding', 'Presentation', 'Icons'],
    downloads: 1750,
    favorites: 390,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
    preview: 'Balanced, neutral visuals for software brands and modern teams.',
    previewMn: 'Software брэнд болон орчин үеийн багт тохирох тэнцвэртэй визуал материал.'
  },
  {
    id: 'res-productivity-system',
    slug: 'weekly-productivity-system',
    title: 'Weekly Productivity System',
    titleMn: 'Долоо Хоногийн Бүтээмжийн Систем',
    type: 'Business Files',
    category: 'Productivity',
    price: 0,
    isFree: true,
    creatorId: 'creator-daniel-kim',
    description: 'A simple planning system for weekly reviews, meeting preparation, and task prioritization for individuals and small teams.',
    descriptionMn: 'Долоо хоногийн review, уулзалтын бэлтгэл, task priority тогтооход зориулсан энгийн төлөвлөлтийн систем.',
    shortDescription: 'Free planning files for focused weekly execution.',
    shortDescriptionMn: 'Долоо хоногийн ажлыг төвлөрөлтэй гүйцэтгэхэд зориулсан үнэгүй төлөвлөлтийн файл.',
    fileType: 'Notion, PDF',
    tags: ['Productivity', 'Planning', 'Notion', 'Templates'],
    downloads: 9400,
    favorites: 1138,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    preview: 'A minimal workflow for planning, review, and execution.',
    previewMn: 'Төлөвлөх, хянах, хэрэгжүүлэхэд зориулсан минимал workflow.'
  },
  {
    id: 'res-doc-bundle',
    slug: 'startup-doc-bundle',
    title: 'Startup Document Bundle',
    titleMn: 'Startup Баримтын Багц',
    type: 'Documents',
    category: 'Documents',
    price: 34,
    isFree: false,
    creatorId: 'creator-daniel-kim',
    description: 'A document set including proposal templates, project briefs, sprint plans, decision logs, and operating docs for early-stage teams.',
    descriptionMn: 'Proposal template, project brief, sprint plan, decision log, operating doc багтсан startup багт зориулсан баримтын багц.',
    shortDescription: 'Document templates for small startup teams and client work.',
    shortDescriptionMn: 'Жижиг startup баг болон client ажлуудад зориулсан баримтын загварууд.',
    fileType: 'DOCX, PDF, Notion',
    tags: ['Documents', 'Operations', 'Startup', 'Templates'],
    downloads: 2110,
    favorites: 511,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    preview: 'Useful for agencies, founders, operators, and project leads.',
    previewMn: 'Agency, founder, operator, project lead нарт ашиглахад тохиромжтой.'
  }
];

export const howItWorks = [
  {
    title: 'Upload a resource',
    titleMn: 'Нөөцөө оруулах',
    description: 'Add a title, cover, description, category, tags, and files in a simple publishing flow.',
    descriptionMn: 'Гарчиг, cover, тайлбар, ангилал, tag, файл зэргээ энгийн publish flow-оор нэмнэ.'
  },
  {
    title: 'Choose free or paid',
    titleMn: 'Үнэгүй эсвэл төлбөртэйг сонгох',
    description: 'Share public downloads for reach or set a price for premium files and knowledge products.',
    descriptionMn: 'Хүртээмжтэй тараахын тулд үнэгүй болгож эсвэл premium файл, мэдлэгийн бүтээгдэхүүндээ үнэ тогтооно.'
  },
  {
    title: 'Help people find it',
    titleMn: 'Хүмүүст олоход нь туслах',
    description: 'Use clear previews, tags, creator profiles, and category pages so the right users can discover it.',
    descriptionMn: 'Зөв хэрэглэгчид олоход нь туслахын тулд preview, tag, creator profile, category page ашиглана.'
  }
];

export function getCategoryLabel(category, locale) {
  if (locale === 'mn') {
    return categoryLabels.mn[category] || category;
  }
  return category;
}

export function getTypeLabel(type, locale) {
  if (locale === 'mn') {
    return typeLabels.mn[type] || type;
  }
  return type;
}

export function getLocalizedField(item, key, locale) {
  if (locale === 'mn' && item?.[`${key}Mn`]) {
    return item[`${key}Mn`];
  }
  return item?.[key];
}

export function getCreatorById(id) {
  return creators.find((creator) => creator.id === id);
}

export function getResourceBySlug(slug) {
  return resources.find((resource) => resource.slug === slug);
}

export function getCreatorBySlug(slug) {
  return creators.find((creator) => creator.slug === slug);
}

export function getResourcesByCreator(creatorId) {
  return resources.filter((resource) => resource.creatorId === creatorId);
}
