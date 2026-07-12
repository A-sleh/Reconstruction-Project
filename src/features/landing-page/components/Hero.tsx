import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { assets } from "@/assets/assets";
import { ArrowRight, Building2 } from "lucide-react";

const slides = [
  {
    image: assets.landingPageImage_modernBuilding,
    alt: "Modern reconstruction building",
  },
  {
    image: assets.homePage_hero_building,
    alt: "Featured reconstruction project",
  },
  { image: assets.homePage_hero_engineer, alt: "Engineering reconstruction" },
  { image: assets.homePage_hero_resource, alt: "Resource management" },
  { image: assets.homePage_hero_service, alt: "Service delivery" },
  {
    image: assets.landingPageImage_jop_engineer,
    alt: "Engineer opportunities",
  },
];

const SLIDE_DURATION = 6000;

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Bottom-Left Content */}
      <div className="absolute bottom-20 right-6 md:right-12 lg:right-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <Building2 className="w-6 h-6 text-white stroke-[1.5]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-light tracking-tight max-w-md  text-white flex flex-col"
        >
          <span className="text-4xl md:text-5xl lg:text-6xl">
            {t("landingPage.hero.headlines").split(".")[0]}
          </span>
          <span className="text-lg md:text-2xl lg:text-4xl">
            {t("landingPage.hero.headlines")
              .split(".")
              .slice(1)
              .join(".")
              .trim()}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6"
        >
          <Link
            to={paths.auth.login.getHref()}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm tracking-wide transition-colors"
            style={{
              backgroundColor: "var(--color-card)",
              color: "var(--color-foreground)",
            }}
          >
            {t("landingPage.hero.cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Progress Bars */}
      <div className="absolute bottom-8 left-6 md:left-12 lg:left-16 right-6 md:right-12 lg:right-16 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="flex-1 h-[2px] bg-white/30 overflow-hidden cursor-pointer"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index === currentSlide
                    ? `${progress}%`
                    : index < currentSlide
                      ? "100%"
                      : "0%",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
