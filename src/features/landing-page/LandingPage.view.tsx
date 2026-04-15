"use client";
import Hero from "./components/Hero";
import Solution from "./components/Solution";
import ProductDemoShow from "./components/ProductDemoShow";
import SocialProof from "./components/SocialProof";
import WhyUs from "./components/WhyUs";
import CallToAction from "./components/CallToAction";
import FAQs from "./components/FAQs";
import Nav from "./components/Nav";
import Loader from "@/components/shared/Loader";

const LandingPage = () => {
  return (
    <section className="scroll-smooth">
      <Nav />
      <Hero />
      <Loader />
      <ProductDemoShow />
      <Solution />
      <SocialProof />
      <WhyUs />
      <CallToAction />
      <FAQs />
    </section>
  );
};

export default LandingPage;
