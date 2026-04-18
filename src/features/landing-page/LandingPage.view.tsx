"use client";
import Solution from "./components/Solution";
import Hero from "./components/Hero";
import ProductDemoShow from "./components/ProductDemoShow";
import SocialProof from "./components/SocialProof";
import WhyUs from "./components/WhyUs";
import CallToAction from "./components/CallToAction";
import FAQs from "./components/FAQs";
import Nav from "./components/Nav";


const LandingPage = () => {
  return (
    <section className="overflow-hidden">
      <Nav />
      <Hero />
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
