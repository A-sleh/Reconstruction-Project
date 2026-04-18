import { useTranslation } from "react-i18next";
import {
  ScrollFadeIn,
  AnimatedButton,
  FloatingElement,
} from "@/components/animations";
import Button from "@/components/inputs/Button";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const CallToAction = () => {
  const { t } = useTranslation();

  return (
    <section
      id="call-to-action"
      className="scroll-mt-24 py-20 bg-linear-to-r from-primary via-primary-hover to-primary-hover-two text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <FloatingElement
          duration={4}
          delay={0}
          className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"
        />
        <FloatingElement
          duration={5}
          delay={1}
          className="absolute bottom-10 right-10 w-16 h-16 bg-secondary rounded-full"
        />
        <FloatingElement
          duration={6}
          delay={2}
          className="absolute top-1/2 left-1/3 w-12 h-12 bg-primary-dark-hover-two rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("landingPage.callToAction.title")}
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.2} className="mb-8">
          <p className="text-xl md:text-2xl mb-8 text-primary-dark-hover-two/90 max-w-3xl mx-auto leading-relaxed">
            {t("landingPage.callToAction.description")}
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn
          delay={0.4}
          className="flex flex-row gap-6 justify-center items-center mb-8"
        >
          <AnimatedButton>
            <Link to={paths.auth.register.asInvestor.path}>
              <Button
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                {t("landingPage.callToAction.createAccount")}
              </Button>
            </Link>
          </AnimatedButton>
          <AnimatedButton>
            <Button
              variant="outline"
              className="px-8 py-4 text-lg font-semibold text-white border-white"
            >
              {t("landingPage.callToAction.contactUs")}
            </Button>
          </AnimatedButton>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.6} className="text-primary-dark-hover-two/80">
          <p className="text-lg mb-2">
            {t("landingPage.callToAction.needHelp")}
          </p>
          <p className="text-sm">{t("landingPage.callToAction.support")}</p>
        </ScrollFadeIn>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-primary-dark to-transparent"></div>
    </section>
  );
};

export default CallToAction;
