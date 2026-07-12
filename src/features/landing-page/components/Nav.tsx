import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const sections: ISectionStructur[] = useMemo(
    () => [
      { id: "hero", label: t("landingPage.nav.home") },
      { id: "features", label: t("landingPage.nav.features") },
      { id: "solutions", label: t("landingPage.nav.solutions") },
      { id: "testimonials", label: t("landingPage.nav.testimonials") },
      { id: "why-us", label: t("landingPage.nav.whyUs") },
      { id: "call-to-action", label: t("landingPage.nav.getStarted") },
      { id: "faq", label: t("landingPage.nav.faq") },
    ],
    [t],
  );

  const handlNavLinkClicked = (section: ISectionStructur) => {
    setActiveSection(section.id);
    setIsMobileMenuOpen(false);
    window.scrollTo({
      top:
        (document.getElementById(`${section.id}`) as HTMLElement)?.getBoundingClientRect()?.top +
        window.scrollY -
        80,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed top-6 left-1/2 z-40 w-11/12 max-w-5xl -translate-x-1/2">
      <div className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-pill bg-canvas-elevated border border-gray-300 rounded-2xl shadow-ambient transition-all duration-300 ${isScrolled ? "bg-canvas-elevated/95 backdrop-blur-lg shadow-ambient" : "bg-white/40"}`}>
        <div className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Syrian Reconstruction Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="hidden sm:block text-body font-semibold text-ink-primary">
            {t("landingPage.nav.brand")}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handlNavLinkClicked(section)}
              aria-current={activeSection === section.id ? "page" : undefined}
              className={`relative px-3 py-2 text-body-sm font-medium rounded-pill transition-colors duration-[120ms] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 hover:bg-primary rounded-xl hover:text-white ${
                activeSection === section.id
                  ? "bg-canvas-overlay text-ink-primary"
                  : "bg-transparent text-ink-secondary hover:bg-canvas-overlay/60 hover:text-ink-primary"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-pill text-ink-secondary hover:bg-canvas-overlay/60 hover:text-ink-primary transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <Link
          to={paths.auth.login.getHref()}
          className="hidden sm:inline-flex items-center justify-center gap-2 h-10 px-4 rounded-pill text-body-sm font-medium bg-ink-primary text-ink-inverse transition-colors duration-[120ms] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-elevated"
        >
          {t("landingPage.nav.login")}
        </Link>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-xl  backdrop-blur-sm border border-gray-300 shadow-raised">
          <nav className="flex flex-col py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handlNavLinkClicked(section)}
                aria-current={activeSection === section.id ? "page" : undefined}
                className={`mx-2 px-4 py-3 text-body-sm font-medium rounded-pill transition-colors duration-[120ms] cursor-pointer text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 ${
                  activeSection === section.id
                    ? "bg-primary text-white my-1"
                    : "bg-transparent text-ink-secondary hover:bg-primary hover:text-white"
                }`}
              >
                {section.label}
              </button>
            ))}
            <div className="border-t border-canvas-border mx-2 mt-2 pt-2">
              <Link
                to={paths.auth.login.getHref()}
                className="mx-2 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-body-sm font-medium bg-primary text-white transition-colors duration-[120ms] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("landingPage.nav.login")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Nav;
