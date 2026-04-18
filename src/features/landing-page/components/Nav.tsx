import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { assets } from "@/assets/assets";
import { Link } from "react-router";
import { paths } from "@/config/paths";

type ISectionStructur = {
  id: string;
  label: string;
};

const Nav = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const sections: ISectionStructur[] = useMemo(
    () => [
      { id: "hero", label: t("landingPage.nav.home") },
      {
        id: "features",
        label: t("landingPage.nav.features"),
      },
      {
        id: "solutions",
        label: t("landingPage.nav.solutions"),
      },
      {
        id: "testimonials",
        label: t("landingPage.nav.testimonials"),
      },
      { id: "why-us", label: t("landingPage.nav.whyUs") },
      {
        id: "call-to-action",
        label: t("landingPage.nav.getStarted"),
      },
      { id: "faq", label: t("landingPage.nav.faq") },
    ],
    [t, activeSection],
  );

  const handlNavLinkClicked = (section: ISectionStructur) => {
    setActiveSection(section.id);
    setIsMobileMenuOpen(false); // Close mobile menu on link click
    window.scrollTo({
      top: (document.getElementById(`${section.id}`) as HTMLElement)?.getBoundingClientRect()?.top + window.scrollY - 80, // Adjust for fixed nav height
      behavior: "smooth"
    })
  };

  return (
    <>
    <div className="fixed top-6 left-[5%] z-40 transition-all duration-500 w-[90%]  bg-white/25  before:absolute before:inset-0 before:-z-10 before:backdrop-blur-lg border-b border-gray-200/50 before:rounded-3xl rounded-3xl ">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Syrian Reconstruction Logo"
            className="h-10 w-10 rounded-full shadow-sm"
          />
          <span className="text-lg font-bold text-gray-800 hidden sm:block">
            {t("landingPage.nav.brand")}
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handlNavLinkClicked(section)}
              aria-current={activeSection === section.id ? "page" : undefined}
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-2xl cursor-pointer ${
                activeSection === section.id
                  ? "bg-primary-hover-two text-white"
                  : "text-black hover:bg-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        <Link to={paths.auth.login.path} className="hidden  sm:block bg-secondary-hover  text-white hover:opacity-70  px-5 py-1 rounded-2xl transition">
          {t("landingPage.nav.login")}
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/25  backdrop-blur-xl border-b border-gray-200/50 rounded-3xl ">
          <nav className="flex flex-col py-4 pb-0 overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handlNavLinkClicked(section)}
                aria-current={activeSection === section.id ? "page" : undefined}
                className={`px-6 py-3  text-sm font-medium transition-colors duration-300 cursor-pointer text-center m-2 rounded-xl ${
                  activeSection === section.id
                    ? "bg-primary-hover-two text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {section.label}
              </button>
            ))}
            <div className="border-t border-gray-200/50 mt-2 pt-2">
              <Link 
                to={paths.auth.login.path} 
                className="block px-6 py-3 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors rounded-b-2xl text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("landingPage.nav.login")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
    </>

  );
};

export default Nav;
