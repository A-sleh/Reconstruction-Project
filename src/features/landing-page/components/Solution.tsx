import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import JoinUsCard from "./JoinUsCard";
import { paths } from "@/config/paths";
import { Link } from "react-router-dom";

const Solution = () => {
  const { t } = useTranslation();

  const userSolutions = [
    {
      title: t("landingPage.solution.serviceProvidorTitle"),
      description: t("landingPage.solution.serviceProvidor"),
      imageIndex: "landingPageImage_jop_service",
      category: t("landingPage.solution.serviceProvidorCategory"),
      mainTitle: t("landingPage.solution.serviceProvidorMainTitle"),
      link: paths.auth.register.asProvider.path,
    },
    {
      title: t("landingPage.solution.engineerSolutions.title"),
      description: t("landingPage.solution.engineerSolutions.description"),
      imageIndex: "landingPageImage_jop_engineer",
      category: t("landingPage.solution.engineerCategory"),
      mainTitle: t("landingPage.solution.engineerMainTitle"),
      link: paths.auth.register.asEngineer.path,
    },
    {
      title: t("landingPage.solution.resourceProvidorTitle"),
      description: t("landingPage.solution.resourceProvidor"),
      imageIndex: "landingPageImage_jop_resource",
      category: t("landingPage.solution.resourceProvidorCategory"),
      mainTitle: t("landingPage.solution.resourceProvidorMainTitle"),
      link: paths.auth.register.asProvider.path,
    },
  ];

  const investorSolutions = t("landingPage.solution.investorSolutions", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  return (
    <section id="solutions" className="scroll-mt-24 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t("landingPage.solution.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("landingPage.solution.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        {/* For Investors */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <StaggerContainer className="flex flex-wrap gap-8">
            {investorSolutions.map((solution, index) => (
              <StaggerItem
                key={index}
                className="rounded-md border border-gray-400 p-3 flex-1 min-w-100"
              >
                <div className="rounded-md hover:bg-gray-300/50 p-3 transition-all group">
                  <h4 className="text-xl font-semibold mb-5 group-hover:text-primary">
                    {solution.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <Link to={paths.auth.register.asInvestor.path}>
            <button className="bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 w-full my-3 transition">
              {t("landingPage.solution.investorSolutionsButton")}
            </button>
          </Link>
        </motion.div>

        {/* For Engineers */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3  mx-auto gap-8">
            {userSolutions.map((solution, index) => (
              <JoinUsCard key={index} {...solution} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
