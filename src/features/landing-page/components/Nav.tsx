import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { assets } from "@/assets/assets";

const Nav = () => {

  const [activeSection,setActiveSection] = useState("hero");
  const { t } = useTranslation();
  const sections = useMemo(
    () => [
      { id: "hero", label: t('nav.home') },
      {
        id: "features",
        label: t('nav.features'),
      },
      {
        id: "solutions",
        label: t('nav.solutions'),
      },
      {
        id: "testimonials",
        label: t('nav.testimonials'),
      },
      { id: "why-us", label: t('nav.whyUs') },
      {
        id: "call-to-action",
        label: t('nav.getStarted'),
      },
      { id: "faq", label: t('nav.faq') },
    ],
    [t, activeSection],
  );

  return (
    <div className="fixed top-0 z-40 transition-all duration-500 w-full bg-white/25 backdrop-blur-xl border-b border-gray-200/50">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img src={assets.logo} alt="Syrian Reconstruction Logo" className="h-10 w-10 rounded-full shadow-sm" />
          <span className="text-lg font-bold text-gray-800 hidden sm:block">
            {t('nav.brand')}
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-6 overflow-x-auto pb-">
          {sections.map((section) => (
            <a
              onClick={() => setActiveSection(section.id)}
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? "page" : undefined}
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                activeSection === section.id
                  ? "bg-primary-hover-two text-white"
                  : "text-black hover:bg-white"
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Nav;
