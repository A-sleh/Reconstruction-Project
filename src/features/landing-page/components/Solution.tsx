import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { TiltCard } from "@/components/3d";
import Button from "@/components/inputs/Button";
import { assets } from "@/assets/assets";
import { paths } from "@/config/paths";
import { Link } from "react-router-dom";

const Solution = () => {
  const { t } = useTranslation();

  const userSolutions = [
    {
      title: t("landingPage.solution.serviceProvidorTitle"),
      description: t("landingPage.solution.serviceProvidor"),
      image: assets.landingPageImage_jop_service,
      category: t("landingPage.solution.serviceProvidorCategory"),
      mainTitle: t("landingPage.solution.serviceProvidorMainTitle"),
      link: paths.auth.register.asProvider.path,
    },
    {
      title: t("landingPage.solution.engineerSolutions.title"),
      description: t("landingPage.solution.engineerSolutions.description"),
      image: assets.landingPageImage_jop_engineer,
      category: t("landingPage.solution.engineerCategory"),
      mainTitle: t("landingPage.solution.engineerMainTitle"),
      link: paths.auth.register.asEngineer.path,
    },
    {
      title: t("landingPage.solution.resourceProvidorTitle"),
      description: t("landingPage.solution.resourceProvidor"),
      image: assets.landingPageImage_jop_resource,
      category: t("landingPage.solution.resourceProvidorCategory"),
      mainTitle: t("landingPage.solution.resourceProvidorMainTitle"),
      link: paths.auth.register.asProvider.path,
    },
  ];

  const investorSolutions = t("landingPage.solution.investorSolutions", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  return (
    <section id="solutions" className="scroll-mt-24 py-24 bg-canvas-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-bold text-ink-primary">
              {t("landingPage.solution.title")}
            </h2>
            <p className="text-body text-ink-secondary max-w-3xl mx-auto mt-4">
              {t("landingPage.solution.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investorSolutions.map((solution, index) => (
              <StaggerItem
                key={index}
                className="flex flex-col bg-canvas-base border border-canvas-border rounded-md p-6"
              >
                <h4 className="text-subtitle font-semibold text-ink-primary mb-4">
                  {solution.title}
                </h4>
                <p className="text-body text-ink-secondary leading-relaxed flex-1">
                  {solution.description}
                </p>
                <Link to={paths.auth.register.asInvestor.path}>
                  <Button variant="solid" className="w-full mt-6">
                    {t("landingPage.solution.investorSolutionsButton")}
                  </Button>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {userSolutions.map((solution, index) => (
              <TiltCard key={index} className="group">
                <div className="rounded-lg bg-canvas-base overflow-hidden border border-canvas-border">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canvas-base/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex rounded-pill bg-canvas-overlay px-3 py-1 text-caption font-medium text-ink-secondary mb-3">
                      {solution.category}
                    </span>
                    <h3 className="text-title font-semibold text-ink-primary mb-3">
                      {solution.mainTitle}
                    </h3>
                    <p className="text-body-sm text-ink-secondary line-clamp-3">
                      {solution.description}
                    </p>
                    <Link to={solution.link}>
                      <Button
                        variant="outline"
                        className="w-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {t("landingPage.nav.getStarted")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
