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

const RTL_LANGUAGES = ['ar'];

const setDocumentDirection = (language: string) => {
  const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial direction
setDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  setDocumentDirection(lng);
});

export default i18n;