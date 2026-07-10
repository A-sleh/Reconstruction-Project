import { useTranslation } from "react-i18next";
import { ScrollFadeIn, AnimatedButton } from "@/components/animations";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { assets } from "@/assets/assets";

const Hero = () => {
  const { t } = useTranslation();
  const stats = [
    {
      value: t("landingPage.hero.stats.projects.value"),
      label: t("landingPage.hero.stats.projects.label"),
    },
    {
      value: t("landingPage.hero.stats.partners.value"),
      label: t("landingPage.hero.stats.partners.label"),
    },
    {
      value: t("landingPage.hero.stats.satisfaction.value"),
      label: t("landingPage.hero.stats.satisfaction.label"),
    },
  ];

  const roles = [
    { label: "Investor", icon: "💰" },
    { label: "Engineer", icon: "🔧" },
    { label: "Service Provider", icon: "🛠️" },
    { label: "Landowner", icon: "🏠" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-canvas-base"
    >
      <div className="absolute inset-0">
        <img
          src={assets.landingPageImage_modernBuilding}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/80 to-[#0A0A0C]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="flex flex-col gap-8">
            <ScrollFadeIn delay={0.2}>
              <span className="inline-flex items-center gap-2 rounded-pill border border-brand-primary/20 bg-brand-primary/10 backdrop-blur-sm px-4 py-2 text-caption font-semibold text-brand-primary">
                {t("landingPage.hero.badge")}
              </span>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.35}>
              <h1 className="text-display-xl font-bold text-ink-primary leading-display-xl">
                {t("landingPage.hero.headlines")}
              </h1>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.5}>
              <p className="max-w-xl text-body text-ink-secondary leading-body">
                {t("landingPage.hero.description")}
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.65}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span
                      key={role.label}
                      className="inline-flex items-center gap-1.5 rounded-pill border border-canvas-border bg-canvas-elevated/50 backdrop-blur-sm px-3.5 py-1.5 text-body-sm text-ink-secondary hover:bg-canvas-elevated/80 hover:border-brand-primary/30 hover:text-ink-primary transition-colors duration-200 cursor-default"
                    >
                      <span>{role.icon}</span>
                      {role.label}
                    </span>
                  ))}
                </div>
                <AnimatedButton>
                  <Link
                    to={paths.auth.login.getHref()}
                    className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-pill text-body font-medium bg-brand-primary text-brand-primary-ink shadow-ambient transition-colors duration-[120ms] hover:bg-[#C4EB2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
                  >
                    {t("landingPage.hero.cta")}
                  </Link>
                </AnimatedButton>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.8}>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-canvas-elevated/40 backdrop-blur-sm rounded-md border border-canvas-border p-4"
                  >
                    <div className="text-display-lg font-bold text-brand-primary">
                      {stat.value}
                    </div>
                    <p className="mt-1 text-body-sm text-ink-secondary">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollFadeIn>
          </div>

          <ScrollFadeIn delay={0.5} direction="right" distance={50}>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 blur" />
              <div className="relative rounded-lg overflow-hidden border border-canvas-border shadow-raised">
                <img
                  src={assets.homePage_hero_building}
                  alt=""
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-base/80 via-canvas-base/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-caption font-medium text-ink-secondary uppercase tracking-wider">
                      {t("landingPage.hero.featured")}
                    </span>
                  </div>
                  <p className="text-title font-semibold text-ink-primary">
                    {t("landingPage.hero.overlayTitle")}
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
