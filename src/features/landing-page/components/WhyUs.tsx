import { useTranslation } from "react-i18next";
import { ScrollFadeIn, StaggerContainer, StaggerItem, ScaleRotateIcon, AnimatedButton } from "@/components/animations";

const WhyUs = () => {
  const { t } = useTranslation();

  const reasons = t('whyUs.reasons', { returnObjects: true }) as Array<{ icon: string; title: string; description: string }>;

  return (
    <section id="why-us" className="scroll-mt-24 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t('whyUs.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('whyUs.subtitle')}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <StaggerItem
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100"
            >
              <ScaleRotateIcon delay={index * 0.1 + 0.3} className="text-4xl mb-4">
                {reason.icon}
              </ScaleRotateIcon>
              <h3 className="text-xl font-semibold text-primary mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.8} className="text-center mt-12">
          <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              {t('whyUs.joinTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('whyUs.joinDescription')}
            </p>
            <AnimatedButton className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors text-lg font-semibold">
              {t('whyUs.register')}
            </AnimatedButton>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default WhyUs;
