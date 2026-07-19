import { useTranslation } from "react-i18next";
import { Building2, Layers, HardHat } from "lucide-react";
import { properties, projects } from "@/data/investor/mock";
import KpiCard from "@/components/shared/KpiCard";

function InvestorLandsAndBuildingsStats() {
  const { t } = useTranslation();
  const buildings = properties.filter((p) => p.type === "building").length;
  const lands = properties.filter((p) => p.type === "land").length;
  const activeProjects = projects.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        label={t("investor.buildings")}
        value={String(buildings)}
        hint={t("investor.operationalAndDev")}
        icon={Building2}
      />
      <KpiCard
        label={t("investor.landParcels")}
        value={String(lands)}
        hint={t("investor.acrossRegions")}
        icon={Layers}
      />
      <KpiCard
        label={t("investor.activeProjects")}
        value={String(activeProjects)}
        hint={t("investor.onSiteConstruction")}
        icon={HardHat}
      />
    </div>
  );
}

export default InvestorLandsAndBuildingsStats;
