// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLanguage } from '../constant/consants';

import en from '../lang/en.json';
import ar from '../lang/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      ar: {
        translation: ar
      }
    },
    lng: defaultLanguage, // Default language
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;