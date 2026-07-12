import { useTranslation } from "react-i18next";
import { ScrollFadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { TiltCard } from "@/components/3d";
import { Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";
import Button from "@/components/inputs/Button";
import { formatDate } from "@/lib/helpers";

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

  return (
    <section id="testimonials" className=" scroll-mt-24  py-24 ">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-bold text-ink-primary">
              {t("landingPage.socialProof.title")}
            </h2>
            <p className="text-body text-ink-secondary max-w-3xl mx-auto mt-4">
              {t("landingPage.socialProof.subtitle")}
            </p>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <TiltCard className="bg-canvas-elevated border border-gray-300 rounded-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border border-canvas-border"
                    />
                    <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-semibold text-ink-primary truncate">
                      {testimonial.author}
                    </h4>
                    <p className="text-caption text-ink-tertiary">
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-brand-primary text-brand-primary"
                        />
                      ))}
                    </div>
                    <p className="text-caption text-ink-tertiary">
                      {formatDate(testimonial.date)}
                    </p>
                  </div>
                </div>
                <blockquote className="text-body text-ink-secondary leading-relaxed text-gray-500 line-clamp-2  relative">
                  <span
                    className="absolute -top-1 -left-1 text-title text-ink-tertiary leading-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  {testimonial.text}
                </blockquote>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollFadeIn delay={0.6} className="text-center mt-16">
          <h3 className="text-title font-semibold text-ink-primary mb-4">
            {t("landingPage.socialProof.join")}
          </h3>
          <Link to={paths.auth.login.path}>
            <Button variant="primary" className="bg-primary text-white rounded-tl-2xl rounded-br-2xl hover:bg-primary hover:opacity-65">
              {t("landingPage.socialProof.cta")}
            </Button>
          </Link>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default SocialProof;
