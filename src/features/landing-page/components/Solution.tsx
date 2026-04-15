import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import JoinUsCard from "./JoinUsCard";

const Solution = () => {
  const { t } = useTranslation();

  const investorSolutions = t("solution.investorSolutions", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;
  const engineerSolutions = t("solution.engineerSolutions", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;
  const resourceSolutions = t("solution.resourceSolutions", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  return (
    <section id="solutions" className="scroll-mt-24 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t("solution.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("solution.subtitle")}
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
          <ScrollFadeIn delay={0.3} className="mb-8">
            <h3 className="text-3xl font-semibold text-primary text-center">
              {t("solution.investorsTitle")}
            </h3>
          </ScrollFadeIn>
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
        </motion.div>

        {/* For Engineers */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ScrollFadeIn delay={0.5} className="mb-8">
            <h3 className="text-3xl font-semibold text-primary text-center">
              {t("solution.engineersTitle")}
            </h3>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-1 max-w-4xl mx-auto gap-8">
            {engineerSolutions.map((solution, index) => (
              <JoinUsCard
                description={solution.description}
                title={solution.title}
                imageIndex="landingPageImage_jop_engineer"
              />
            ))}
          </div>
        </motion.div>


        {/* For Resources and Services */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <ScrollFadeIn delay={0.7} className="mb-8">
            <h3 className="text-3xl font-semibold text-primary text-center">
              {t("solution.resourcesTitle")}
            </h3>
          </ScrollFadeIn>
          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {resourceSolutions.map((solution, index) => (
              <StaggerItem
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h4 className="text-xl font-semibold text-primary mb-3">
                  {solution.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
