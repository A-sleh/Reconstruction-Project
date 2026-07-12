import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";
import { assets } from "@/assets/assets";
import { Mail } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  const LI_STYLE = "px-2 py-2 hover:rounded-md hover:bg-primary transition";

  return (
    <footer className="py-10 lg:py-12 bg-[#142015] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:gap-12">
          {/* Brand Row */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={assets.logo} alt="Reconstruction" className="h-8 w-8 rounded-full" />
              <span className="text-body font-semibold">{t("landingPage.nav.brand")}</span>
            </div>
            <p className="text-ink-inverse/70 text-body-sm leading-relaxed max-w-xl">
              {t("landingPage.hero.description")}
            </p>
          </div>

          {/* Pages Row */}
          <div >
            <h4 className="text-body font-medium mb-4">{t("landingPage.nav.features")}</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li className={LI_STYLE}>
                <a href="#hero" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.home")}
                </a>
              </li>
              <li className={LI_STYLE}>
                <a href="#features" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.features")}
                </a>
              </li>
              <li className={LI_STYLE}>
                <a href="#solutions" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.solutions")}
                </a>
              </li>
              <li className={LI_STYLE}>
                <a href="#testimonials" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.testimonials")}
                </a>
              </li>
              <li className={LI_STYLE}>
                <a href="#why-us" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.whyUs")}
                </a>
              </li>
              <li className={LI_STYLE}>
                <a href="#faq" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm">
                  {t("landingPage.nav.faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Row */}
          <div>
            <h4 className="text-body font-medium mb-4">
              {t("landingPage.callToAction.contactUs")}
            </h4>
            <div className="flex flex-col gap-2 mb-8">
              <a href="mailto:info@reconstruction.com" className="text-ink-inverse/70 hover:text-ink-inverse transition-colors duration-200 text-body-sm flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                abdulfatahasleh@gmail.com
              </a>
            </div>
            <div className="flex gap-3">
              <Link
                to={paths.auth.register.asInvestor.path}
                className="inline-flex items-center justify-center h-9 px-4 rounded-pill text-body-sm font-medium border border-ink-inverse/30 text-ink-inverse hover:bg-ink-inverse/10 transition-colors duration-200"
              >
                {t("landingPage.callToAction.createAccount")}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-inverse/20 pt-8 mt-12 text-center text-ink-inverse/50 text-body-sm">
          <p>&copy; {new Date().getFullYear()} {t("landingPage.nav.brand")} </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
