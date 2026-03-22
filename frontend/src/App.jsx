import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/site-layout';
import { LanguageProvider } from './lib/i18n';
import { AuthPage } from './pages/auth-page';
import { CreatorProfilePage } from './pages/creator-profile-page';
import { ExplorePage } from './pages/explore-page';
import { HomePage } from './pages/home-page';
import { ResourceDetailPage } from './pages/resource-detail-page';
import { UploadPage } from './pages/upload-page';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/resources/:slug" element={<ResourceDetailPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/creators/:slug" element={<CreatorProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </SiteLayout>
      </BrowserRouter>
    </LanguageProvider>
  );
}
