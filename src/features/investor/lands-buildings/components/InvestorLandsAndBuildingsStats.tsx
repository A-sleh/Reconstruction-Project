import { useTranslation } from "react-i18next";
import { Building2, Layers, HardHat } from "lucide-react";
import KpiCard from "@/components/shared/KpiCard";
import { useInvestorProperties } from "../api/query";

function InvestorLandsAndBuildingsStats() {
  const { t } = useTranslation();
  const { data, isLoading } = useInvestorProperties();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        label={t("investor.buildings")}
        value={isLoading ? "—" : String(data?.totalBuidlings ?? 0)}
        hint={t("investor.operationalAndDev")}
        icon={Building2}
      />
      <KpiCard
        label={t("investor.landParcels")}
        value={isLoading ? "—" : String(data?.totalLands ?? 0)}
        hint={t("investor.acrossRegions", { lands: data?.totalBuidlings })}
        icon={Layers}
      />
      <KpiCard
        label={t("investor.activeProjects")}
        value={isLoading ? "—" : String(data?.allOpenedProjects ?? 0)}
        hint={t("investor.onSiteConstruction")}
        icon={HardHat}
      />
    </div>
  );
}

export default InvestorLandsAndBuildingsStats;
