import { lazy, Suspense } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";

const ProductDemoShow = lazy(() => import("./components/ProductDemoShow"));
const Solution = lazy(() => import("./components/Solution"));
const SocialProof = lazy(() => import("./components/SocialProof"));
const WhyUs = lazy(() => import("./components/WhyUs"));
const CallToAction = lazy(() => import("./components/CallToAction"));
const FAQs = lazy(() => import("./components/FAQs"));

const SectionFallback = () => (
  <div className="h-96 w-full bg-canvas-elevated animate-pulse" />
);

const LandingPage = () => {
  return (
    <section className="overflow-hidden bg-canvas-base">
      <Nav />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <ProductDemoShow />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Solution />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SocialProof />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyUs />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CallToAction />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQs />
      </Suspense>
    </section>
  );
};

export default LandingPage;
