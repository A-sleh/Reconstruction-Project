import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Root / generic translations
import arRoot from "@/lang/ar.json";
import enRoot from "@/lang/en.json";

// Feature translations
import arAuth from "@/features/Auth/i18n/ar.json";
import enAuth from "@/features/Auth/i18n/en.json";
import arHome from "@/features/home/i18n/ar.json";
import enHome from "@/features/home/i18n/en.json";
import arLandingPage from "@/features/landing-page/i18n/ar.json";
import enLandingPage from "@/features/landing-page/i18n/en.json";
import arOrders from "@/features/orders/i18n/ar.json";
import enOrders from "@/features/orders/i18n/en.json";
import arResourceProvidor from "@/features/resource-providor/i18n/ar.json";
import enResourceProvidor from "@/features/resource-providor/i18n/en.json";

import arCategoryBank from "@/features/category-bank/i18n/ar.json";
import enCategoryBank from "@/features/category-bank/i18n/en.json";
import arEngineerProfile from "@/features/engineer/profile/i18n/ar.json";
import enEngineerProfile from "@/features/engineer/profile/i18n/en.json";
import arInvestor from "@/features/investor/lands-buildings/i18n/ar.json";
import enInvestor from "@/features/investor/lands-buildings/i18n/en.json";
import arProfile from "@/features/profile/i18n/ar.json";
import enProfile from "@/features/profile/i18n/en.json";
import arSupport from "@/features/support/i18n/ar.json";
import enSupport from "@/features/support/i18n/en.json";
import arSystemUsers from "@/features/system-users/i18n/ar.json";
import enSystemUsers from "@/features/system-users/i18n/en.json";
import arWorkSiteItems from "@/features/work-site-items/i18n/ar.json";
import enWorkSiteItems from "@/features/work-site-items/i18n/en.json";
import arWorkSites from "@/features/work-sites/i18n/ar.json";
import enWorkSites from "@/features/work-sites/i18n/en.json";
import arProject from "@/features/project/i18n/ar.json";
import enProject from "@/features/project/i18n/en.json";
import arWorkShop from "@/features/work-shop/i18n/ar.json";
import enWorkShop from "@/features/work-shop/i18n/en.json";
import arProjectsEngineers from "@/features/projects-engineers/i18n/ar.json";
import enProjectsEngineers from "@/features/projects-engineers/i18n/en.json";
import arProjectReports from "@/features/project-reports/i18n/ar.json";
import enProjectReports from "@/features/project-reports/i18n/en.json";
import arCart from "@/features/cart/i18n/ar.json";
import enCart from "@/features/cart/i18n/en.json";
import arAttachment from "@/features/attachment/i18n/ar.json";
import enAttachment from "@/features/attachment/i18n/en.json";
import arPublicProvider from "@/features/public-provider/i18n/ar.json";
import enPublicProvider from "@/features/public-provider/i18n/en.json";

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
      enLandingPage,
      enOrders,
      enHome,
      enWorkSites,
      enProfile,
      enSystemUsers,
      enCategoryBank,
      enSupport,
      enInvestor,
      enWorkSiteItems,
      enEngineerProfile,
      enProject,
      enCart,
      enWorkShop,
      enProjectsEngineers,
      enProjectReports,
      enAttachment,
      enPublicProvider,
    ),
  },
  ar: {
    translation: mergeTranslations(
      arRoot,
      arAuth,
      arResourceProvidor,
      arLandingPage,
      arOrders,
      arHome,
      arWorkSites,
      arProfile,
      arSystemUsers,
      arCategoryBank,
      arSupport,
      arInvestor,
      arWorkSiteItems,
      arEngineerProfile,
      arProject,
      arCart,
      arWorkShop,
      arProjectsEngineers,
      arProjectReports,
      arAttachment,
      arPublicProvider,
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
