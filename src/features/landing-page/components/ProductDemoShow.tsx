import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn } from "@/components/animations";
import { assets } from "@/assets/assets";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/config/paths";

const cards = [
  {
    title: "landingPage.productDemo.features.0.title",
    description: "landingPage.productDemo.features.0.description",
    image: assets.landingPageImage_projectManagment,
    tag: "Management",
    rotate: -6,
  },
  {
    title: "landingPage.productDemo.features.1.title",
    description: "landingPage.productDemo.features.1.description",
    image: assets.landingPageImage_buildingSearching,
    tag: "Search",
    rotate: 3,
  },
  {
    title: "landingPage.productDemo.features.2.title",
    description: "landingPage.productDemo.features.2.description",
    image: assets.landingPageImage_structuralEngineer,
    tag: "Engineers",
    rotate: -3,
  },
  {
    title: "landingPage.productDemo.features.3.title",
    description: "landingPage.productDemo.features.3.description",
    image: assets.landingPageImage_reporting,
    tag: "Reports",
    rotate: 6,
  },
];

const ProductDemoShow = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="scroll-mt-24 py-24 bg-canvas-base ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-bold text-ink-primary">
              {t("landingPage.productDemo.title")}
            </h2>
            <p className="text-body text-ink-secondary max-w-3xl mx-auto mt-4">
              {t("landingPage.productDemo.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <div className="flex flex-wrap justify-center  md:flex-nowrap w-full ">
          {cards.map((card, index) => (
            <FeatureCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  card,
  index,
}: {
  card: { title: string; description: string; image: string; tag: string; rotate: number };
  index: number;
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: card.rotate }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotate: card.rotate }
          : { opacity: 0, y: 40, rotate: card.rotate }
      }
      whileHover={{ rotate: 0, y: -12, scale: 1.04, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-72 cursor-pointer"
      style={{ zIndex: 10 - Math.abs(index - 1.5) }}
    >
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-card transition-shadow duration-300 hover:shadow-2xl">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={card.image}
            alt={card.tag}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 px-2 py-1 rounded-sm bg-white/90 backdrop-blur-sm">
            <span className="text-caption font-medium" style={{ color: "var(--color-foreground)" }}>
              {card.tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-sm font-semibold mb-1 tracking-tight"
            style={{ color: "var(--color-foreground)" }}
          >
            {t(card.title)}
          </h3>
          <p
            className="text-xs leading-relaxed mb-4 line-clamp-3"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {t(card.description)}
          </p>
          <Link
            to={paths.auth.login.getHref()}
            className="flex items-center gap-1.5 text-caption font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            <span>{t("landingPage.productDemo.tryNow")}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDemoShow;
