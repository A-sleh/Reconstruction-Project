import { useTranslation } from "react-i18next";
import { ScrollFadeIn } from "@/components/animations";
import { SceneCanvas, FloatingGeometry } from "@/components/3d";
import Button from "@/components/inputs/Button";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const CallToAction = () => {
  const { t } = useTranslation();

  return (
    <section
      id="call-to-action"
      className="bg-canvas-base relative overflow-hidden scroll-mt-24 py-24"
    >
      {/* 3D background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <SceneCanvas>
          <FloatingGeometry variant="icosahedron" position={[-4, 3, 0]} scale={1.5} />
          <FloatingGeometry variant="torusKnot" position={[4, -3, 0]} scale={1.5} />
        </SceneCanvas>
      </div>

      <ScrollFadeIn>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-display-lg font-bold text-ink-primary mb-6">
            {t("landingPage.callToAction.title")}
          </h2>

          <p className="text-subtitle text-ink-secondary mb-10 max-w-2xl mx-auto">
            {t("landingPage.callToAction.description")}
          </p>

          <div className="flex flex-row gap-4 justify-center">
            <Link to={paths.auth.register.asInvestor.path}>
              <Button
                variant="solid"
                className="px-8 py-4 bg-brand-primary text-brand-primary-ink rounded-pill"
              >
                {t("landingPage.callToAction.createAccount")}
              </Button>
            </Link>
            <Link to="#contact">
              <Button
                variant="outline"
                className="px-8 py-4 border-canvas-border text-ink-primary"
              >
                {t("landingPage.callToAction.contactUs")}
              </Button>
            </Link>
          </div>

          <p className="text-body-sm text-ink-tertiary mt-8">
            {t("landingPage.callToAction.support")}
          </p>
        </div>
      </ScrollFadeIn>
    </section>
  );
};

export default CallToAction;
