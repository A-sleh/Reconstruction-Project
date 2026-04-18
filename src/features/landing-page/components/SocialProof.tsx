import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedButton,
} from "@/components/animations";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const SocialProof = () => {
  const { t } = useTranslation();

  const testimonials = t("landingPage.socialProof.testimonials", {
    returnObjects: true,
  }) as Array<{
    text: string;
    author: string;
    role: string;
    image: string;
    date: string;
  }>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section id="testimonials" className="scroll-mt-24 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t("landingPage.socialProof.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("landingPage.socialProof.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <StaggerItem
              key={index}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-[0_0_4px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                {/* User Info Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {testimonial.author}
                    </h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex text-yellow-400 mb-1">
                      {[
                        ...Array(
                          (Math.ceil(Math.random() * 10 * index) % 5) + 1,
                        ),
                      ].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDate(testimonial.date)}
                    </p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 leading-relaxed text-sm relative">
                  <span className="text-2xl text-primary/30 absolute -top-2 -left-2">
                    "
                  </span>
                  {testimonial.text}
                  <span className="text-2xl text-primary/30 absolute -bottom-4 -right-4">
                    "
                  </span>
                </blockquote>
              </div>

              {/* Decorative Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary-hover"></div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.6} className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            {t("landingPage.socialProof.join")}
          </p>
          <Link to={paths.auth.login.path}>
            <AnimatedButton className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-colors text-lg font-semibold">
              {t("landingPage.socialProof.cta")}
            </AnimatedButton>
          </Link>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default SocialProof;
