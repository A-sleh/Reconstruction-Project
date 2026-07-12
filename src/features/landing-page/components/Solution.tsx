import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn } from "@/components/animations";
import { assets } from "@/assets/assets";
import { paths } from "@/config/paths";
import { Link } from "react-router-dom";

const AnimatedTimelineLine = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="absolute inset-0 flex justify-center">
      <div className="relative w-full h-full">
        {/* Background track */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px h-full hidden md:block"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        {/* Animated primary line */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-px origin-top hidden md:block"
          style={{ backgroundColor: "var(--color-primary)" }}
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Mobile track */}
        <div
          className="absolute left-6 w-px h-full md:hidden"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        {/* Mobile animated line */}
        <motion.div
          className="absolute left-6 w-px origin-top md:hidden"
          style={{ backgroundColor: "var(--color-primary)" }}
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const solutionImages = [
  assets.landingPageImage_investorReliable,
  assets.landingPageImage_jop_service,
  assets.landingPageImage_investorNetwork,
  assets.landingPageImage_jop_engineer,
  assets.landingPageImage_investorPlatform,
  assets.landingPageImage_jop_resource,
];

const Solution = () => {
  const { t } = useTranslation();

  const allSolutions = [
    {
      title: t("landingPage.solution.investorSolutions-title-1"),
      description: t("landingPage.solution.investorSolutions-description-1"),
      category: t("landingPage.solution.investorsTitle"),
      link: paths.auth.register.asInvestor.path,
      image: solutionImages[0],
    },
    {
      title: t("landingPage.solution.serviceProvidorMainTitle"),
      description: t("landingPage.solution.serviceProvidor"),
      category: t("landingPage.solution.serviceProvidorCategory"),
      link: paths.auth.register.asProvider.path,
      image: solutionImages[1],
    },
    {
      title: t("landingPage.solution.investorSolutions-title-2"),
      description: t("landingPage.solution.investorSolutions-description-2"),
      category: t("landingPage.solution.investorsTitle"),
      link: paths.auth.register.asInvestor.path,
      image: solutionImages[2],
    },
    {
      title: t("landingPage.solution.engineerMainTitle"),
      description: t("landingPage.solution.engineerSolutions.description"),
      category: t("landingPage.solution.engineerCategory"),
      link: paths.auth.register.asEngineer.path,
      image: solutionImages[3],
    },
    {
      title: t("landingPage.solution.investorSolutions-title-3"),
      description: t("landingPage.solution.investorSolutions-description-3"),
      category: t("landingPage.solution.investorsTitle"),
      link: paths.auth.register.asInvestor.path,
      image: solutionImages[4],
    },
    {
      title: t("landingPage.solution.resourceProvidorMainTitle"),
      description: t("landingPage.solution.resourceProvidor"),
      category: t("landingPage.solution.resourceProvidorCategory"),
      link: paths.auth.register.asProvider.path,
      image: solutionImages[5],
    },
    {
      title: t("landingPage.solution.investorSolutions-title-4"),
      description: t("landingPage.solution.investorSolutions-description-4"),
      category: t("landingPage.solution.investorsTitle"),
      link: paths.auth.register.asInvestor.path,
      image: solutionImages[4],
    },
  ];

  return (
    <section
      id="solutions"
      className="scroll-mt-24 py-24 relative overflow-hidden bg-gray-300/10"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollFadeIn>
          <div className="text-center mb-20">
            <h2 className="text-display-lg font-bold text-ink-primary">
              {t("landingPage.solution.title")}
            </h2>
            <p className="text-body text-ink-secondary max-w-3xl mx-auto mt-4">
              {t("landingPage.solution.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        {/* Timeline */}
        <div className="relative">
          {/* Animated timeline line */}
          <AnimatedTimelineLine />

          <div className="flex flex-col gap-12">
            {allSolutions.map((solution, index) => (
              <TimelineCard
                key={index}
                solution={solution}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineCard = ({
  solution,
  index,
}: {
  solution: {
    title: string;
    description: string;
    category: string;
    link: string;
    image: string;
  };
  index: number;
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Center dot */}
      <motion.div
        className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 z-10"
        initial={{ scale: 0, backgroundColor: "var(--color-card)" }}
        animate={
          isInView
            ? {
                scale: 1,
                backgroundColor: "var(--color-primary)",
                boxShadow: "0 0 20px var(--color-primary)",
              }
            : { scale: 0, backgroundColor: "var(--color-card)" }
        }
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          borderColor: "var(--color-primary)",
        }}
      />

      {/* Card — left or right */}
      <div
        className={`w-full md:w-[calc(50%-2rem)] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        } pl-14 md:pl-0`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={
            isInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: isLeft ? -60 : 60 }
          }
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <img
            src={solution.image}
            alt={solution.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-6">
            <span
              className="inline-block text-caption font-medium px-2.5 py-1 rounded-sm mb-3"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              {solution.category}
            </span>
            <h3
              className="text-subtitle font-semibold mb-2 tracking-tight"
              style={{ color: "var(--color-foreground)" }}
            >
              {solution.title}
            </h3>
            <p
              className="text-body-sm leading-relaxed mb-4"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {solution.description}
            </p>
            <Link
              to={solution.link}
              className="inline-flex items-center gap-2 text-caption font-medium transition-colors duration-200 text-primary px-2 py-1.5 rounded-md hover:bg-primary hover:text-white"
            >
              {t("landingPage.nav.getStarted")}
              <span>&rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Solution;
