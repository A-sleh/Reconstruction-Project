import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Root / generic translations
import enRoot from "@/lang/en.json";
import arRoot from "@/lang/ar.json";

// Feature translations
import enAuth from "@/features/Auth/i18n/en.json";
import arAuth from "@/features/Auth/i18n/ar.json";
import enResourceProvidor from "@/features/resource-providor/i18n/en.json";
import arResourceProvidor from "@/features/resource-providor/i18n/ar.json";
import enServiceProvider from "@/features/service-providor/i18n/en.json";
import arServiceProvider from "@/features/service-providor/i18n/ar.json";
import enLandingPage from "@/features/landing-page/i18n/en.json";
import arLandingPage from "@/features/landing-page/i18n/ar.json";
import enOrders from "@/features/orders/i18n/en.json";
import arOrders from "@/features/orders/i18n/ar.json";
import enHome from "@/features/home/i18n/en.json";
import arHome from "@/features/home/i18n/ar.json";

import enWorkSites from "@/features/work-sites/i18n/en.json";
import arWorkSites from "@/features/work-sites/i18n/ar.json";

function mergeTranslations(...objects: Record<string, unknown>[]) {
  return objects.reduce<Record<string, unknown>>((acc, obj) => {
    for (const key of Object.keys(obj)) {
      if (key in acc) {
        console.warn(
          `[i18n] Duplicate key "${key}" found during merge — last value wins.`,
        );
      }
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

const resources = {
  en: {
    translation: mergeTranslations(
      enRoot,
      enAuth,
      enResourceProvidor,
      enServiceProvider,
      enLandingPage,
      enOrders,
      enHome,
      enWorkSites,
    ),
  },
  ar: {
    translation: mergeTranslations(
      arRoot,
      arAuth,
      arResourceProvidor,
      arServiceProvider,
      arLandingPage,
      arOrders,
      arHome,
      arWorkSites,
    ),
  },
};

const updateDirection = (lng: string) => {
  const direction = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Set initial direction
updateDirection(i18n.language);

// Listen for language changes
i18n.on("languageChanged", updateDirection);

export default i18n;
