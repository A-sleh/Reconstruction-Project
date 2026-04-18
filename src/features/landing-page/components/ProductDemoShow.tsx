import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ScrollFadeIn, AnimatedButton } from "@/components/animations";
import { assets } from "@/assets/assets";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const ProductDemoShow = () => {
  const { t } = useTranslation();

  const features = t("landingPage.productDemo.features", {
    returnObjects: true,
  }) as Array<{ title: string; description: string; image: string }>;

  return (
    <section id="features" className="scroll-mt-24 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t("landingPage.productDemo.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              {/* Content */}
              <motion.div
                className="flex-1 space-y-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-primary">
                  {feature.title}
                </h3>
                {/* Image */}
                <motion.div
                  className="flex-1 md:hidden"
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.img
                    // @ts-ignore
                    src={assets[feature.image]}
                    className="bg-gray-200 rounded-lg h-80 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <Link to={paths.auth.login.getHref()}>
                  <AnimatedButton className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors">
                    {t("landingPage.productDemo.tryNow")}
                  </AnimatedButton>
                </Link>
              </motion.div>

              {/* Image */}
              <motion.div
                className="flex-1 hidden md:block"
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                viewport={{ once: true }}
              >
                <motion.img
                  // @ts-ignore
                  src={assets[feature.image]}
                  className="bg-gray-200 rounded-lg h-80 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDemoShow;
