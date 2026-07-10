import { useTranslation } from "react-i18next";
import { ScrollFadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { TiltCard } from "@/components/3d";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";
import Button from "@/components/inputs/Button";

const WhyUs = () => {
  const { t } = useTranslation();

  const reasons = t("landingPage.whyUs.reasons", {
    returnObjects: true,
  }) as Array<{ image: string; title: string; description: string }>;

  return (
    <section id="why-us" className="bg-canvas-elevated scroll-mt-24 py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-bold text-ink-primary">
              {t("landingPage.whyUs.title")}
            </h2>
            <p className="text-body text-ink-secondary max-w-3xl mx-auto mt-4">
              {t("landingPage.whyUs.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <StaggerItem key={index}>
              <TiltCard className="group bg-canvas-base border border-canvas-border rounded-md overflow-hidden hover:border-brand-primary/30 transition-colors duration-200">
                <img
                  src={reason.image}
                  alt={reason.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-title font-semibold text-ink-primary mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-body-sm text-ink-secondary leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.8} className="mt-16">
          <div className="bg-canvas-overlay border border-canvas-border rounded-md p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-title font-semibold text-ink-primary mb-4">
              {t("landingPage.whyUs.joinTitle")}
            </h3>
            <p className="text-body text-ink-secondary mb-6">
              {t("landingPage.whyUs.joinDescription")}
            </p>
            <Link to={paths.auth.login.path}>
              <Button variant="primary">
                {t("landingPage.whyUs.register")}
              </Button>
            </Link>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default WhyUs;
