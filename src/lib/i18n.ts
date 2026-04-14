import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/lang/en.json';
import ar from '@/lang/ar.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

const updateDirection = (lng: string) => {
  const direction = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial direction
updateDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', updateDirection);

export default i18n;