import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedButton,
} from "@/components/animations";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const WhyUs = () => {
  const { t } = useTranslation();

  const reasons = t("landingPage.whyUs.reasons", {
    returnObjects: true,
  }) as Array<{ image: string; title: string; description: string }>;

  return (
    <section id="why-us" className="scroll-mt-24 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t("landingPage.whyUs.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("landingPage.whyUs.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <StaggerItem
              key={index}
              className="relative group bg-white rounded-2xl shadow-lg hover:shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <img
                  src={reason.image}
                  alt={reason.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-hover transition-colors">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {reason.description}
                </p>
              </div>

              {/* Decorative Bottom Border */}
              <div className="absolute bottom-0 w-full h-1 bg-linear-to-r from-primary to-primary-hover transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.8} className="text-center mt-12">
          <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              {t("landingPage.whyUs.joinTitle")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("landingPage.whyUs.joinDescription")}
            </p>
            <Link to={paths.auth.login.path}>
              <AnimatedButton className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors text-lg font-semibold">
                {t("landingPage.whyUs.register")}
              </AnimatedButton>
            </Link>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default WhyUs;
