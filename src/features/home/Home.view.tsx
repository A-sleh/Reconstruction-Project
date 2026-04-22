import EngineerSection from "./components/Engineer-section";
import Hero from "./components/Hero";
import InvestorSection from "./components/Investor-section";
import LandingSection from "./components/Landing-section";
import ProjectSection from "./components/Project-section";

const Home = () => {
  return (
    <div >
        <Hero />
        <LandingSection />
        <InvestorSection />
        <ProjectSection />
        <EngineerSection />
    </div>
  )
}

export default Home;
