import { useTranslation } from "react-i18next";
import { ScrollFadeIn, StaggerContainer, StaggerItem, AnimatedButton } from "@/components/animations";

const SocialProof = () => {
  const { t } = useTranslation();

  const testimonials = t('socialProof.testimonials', { returnObjects: true }) as Array<{ text: string; author: string; role: string }>;

  return (
    <section id="testimonials" className="scroll-mt-24 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t('socialProof.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('socialProof.subtitle')}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <StaggerItem
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <div className="flex text-secondary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <blockquote className="text-gray-700 italic leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
              </div>
              <div className="border-t pt-4">
                <div className="font-semibold text-primary">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.6} className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            {t('socialProof.join')}
          </p>
          <AnimatedButton className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors text-lg font-semibold">
            {t('socialProof.cta')}
          </AnimatedButton>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default SocialProof;
