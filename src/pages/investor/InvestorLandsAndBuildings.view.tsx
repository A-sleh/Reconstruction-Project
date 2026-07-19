import InvestorLandsAndBuildingsHeader from "@/features/investor/lands-buildings/components/InvestorLandsAndBuildingsHeader";
import InvestorLandsAndBuildingsStats from "@/features/investor/lands-buildings/components/InvestorLandsAndBuildingsStats";
import InvestorLandsAndBuildingsTabs from "@/features/investor/lands-buildings/components/InvestorLandsAndBuildingsTabs";

const InvestorLandsAndBuildings = () => {
  return (
    <div className="space-y-6">
      <InvestorLandsAndBuildingsHeader />
      <InvestorLandsAndBuildingsStats />
      <InvestorLandsAndBuildingsTabs />
    </div>
  );
};

export default InvestorLandsAndBuildings;
