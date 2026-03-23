import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SiteLayout } from './components/site-layout';
import { AuthProvider } from './lib/auth';
import { LanguageProvider, useLanguage } from './lib/i18n';
import { AuthPage } from './pages/auth-page';
import { CreatorProfilePage } from './pages/creator-profile-page';
import { ExplorePage } from './pages/explore-page';
import { HomePage } from './pages/home-page';
import { ResourceDetailPage } from './pages/resource-detail-page';
import { UploadPage } from './pages/upload-page';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <SiteLayout>
            <AnimatedRoutes />
          </SiteLayout>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.hash}`;

  return (
    <div key={routeKey} className="page-transition">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/resources/:slug" element={<ResourceDetailPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/creators/:slug" element={<CreatorProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function NotFoundPage() {
  const { locale } = useLanguage();

  return (
    <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
      <div className="empty-state">
        <h1 className="page-title text-white">{locale === 'mn' ? 'Хуудас олдсонгүй' : 'Page not found'}</h1>
        <p className="mt-4 text-slate-300">
          {locale === 'mn'
            ? 'Таны хүссэн хуудас байхгүй эсвэл өөрчлөгдсөн байна.'
            : 'The page you requested does not exist or has moved.'}
        </p>
      </div>
    </main>
  );
}
