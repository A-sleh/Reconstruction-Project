import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn } from "@/components/animations";
import { ProductScene } from "@/components/3d";
import Button from "@/components/inputs/Button";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const ProductDemoShow = () => {
  const { t } = useTranslation();

  const features = t("landingPage.productDemo.features", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  return (
    <section id="features" className="scroll-mt-24 py-24 bg-canvas-base">
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

        <div className="space-y-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex-1 space-y-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-title font-semibold text-ink-primary">
                  {feature.title}
                </h3>
                <p className="text-body text-ink-secondary leading-relaxed">
                  {feature.description}
                </p>
                <Link to={paths.auth.login.getHref()}>
                  <Button variant="outline">
                    {t("landingPage.productDemo.tryNow")}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                viewport={{ once: true }}
              >
                <ProductScene variant={index % 2 === 0 ? "chart" : "graph"} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDemoShow;
