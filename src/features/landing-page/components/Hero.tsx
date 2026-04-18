import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn, AnimatedButton, FloatingElement } from "@/components/animations";
import Button from "@/components/inputs/Button";
import { assets } from "@/assets/assets";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const Hero = () => {
  const { t } = useTranslation();
  const stats = [
    {
      value: t('landingPage.hero.stats.projects.value'),
      label: t('landingPage.hero.stats.projects.label')
    },
    {
      value: t('landingPage.hero.stats.partners.value'),
      label: t('landingPage.hero.stats.partners.label')
    },
    {
      value: t('landingPage.hero.stats.satisfaction.value'),
      label: t('landingPage.hero.stats.satisfaction.label')
    }
  ];

  return (
    <section id="hero" className="scroll-mt-24 relative overflow-hidden bg-linear-to-br from-primary via-primary-hover to-primary-hover-two text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8">
            <ScrollFadeIn delay={0.2}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                {t('landingPage.hero.badge')}
              </span>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.35}>
              <h1 className="max-sm:text-center text-3xl font-black leading-tight -tracking-tighter sm:text-4xl lg:text-5xl">
                {t('landingPage.hero.headlines')}
              </h1>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.5}>
              <p className="max-sm:text-center max-sm:max-w-sm max-sm:mx-auto  max-w-2xl text-md text-white/90 sm:text-xl">
                {t('landingPage.hero.description')}
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.65} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <AnimatedButton>
                <Link to={paths.auth.login.getHref()}>
                <Button  variant="secondary" className="px-8 py-3 text-lg min-w-40">
                  {t('landingPage.hero.cta')}
                </Button>
                </Link>
              </AnimatedButton>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.8}>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                  >
                    <div className="text-3xl font-semibold text-white">{stat.value}</div>
                    <p className="mt-2 text-sm text-white/75">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollFadeIn>
          </div>

          <ScrollFadeIn delay={0.4}>
            <div className="relative mx-auto max-w-xl">
              <FloatingElement duration={5} delay={0.8} className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/20" />
              <div className="relative overflow-hidden rounded-4xl border border-white/20 bg-white/10 shadow-2xl shadow-primary/20 backdrop-blur-xl">
                <img
                  src={assets.landingPageImage_structuralEngineer}
                  alt={t('landingPage.hero.alt')}
                  className="h-130 w-full object-cover object-center"
                />
                <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {t('landingPage.hero.featured')}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {t('landingPage.hero.support')}
                    </span>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-900">
                    {t('landingPage.hero.overlayTitle')}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {t('landingPage.hero.overlayDescription')}
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
