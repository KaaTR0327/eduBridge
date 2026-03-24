import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'edubridge-locale';

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') {
      return 'mn';
    }
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (savedLocale === 'mn' || savedLocale === 'en') {
      return savedLocale;
    }

    const browserLocale = window.navigator.language?.toLowerCase() || '';
    return browserLocale.startsWith('mn') ? 'mn' : 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
    document.documentElement.lang = locale === 'mn' ? 'mn' : 'en';
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    toggleLocale: () => setLocale((current) => (current === 'mn' ? 'en' : 'mn'))
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

export function getLocalizedField(item, key, locale) {
  if (locale === 'mn' && item?.[`${key}Mn`]) {
    return item[`${key}Mn`];
  }
  return item?.[key];
}
