import KpiCard from "@/components/shared/KpiCard";
import { Building2, HardHat, Truck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSystemUserStats } from "../api/query";

const UserKPISection: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useSystemUserStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Users}
        label={t("systemUsers.kpi.investors")}
        value={String(stats?.investors ?? 0)}
        hint={t("systemUsers.kpi.investorsHint")}
        accent="bg-emerald-500/10 text-emerald-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Truck}
        label={t("systemUsers.kpi.resourceProviders")}
        value={String(stats?.resourceProviders ?? 0)}
        hint={t("systemUsers.kpi.resourceProvidersHint")}
        accent="bg-indigo-500/10 text-indigo-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Building2}
        label={t("systemUsers.kpi.serviceProviders")}
        value={String(stats?.serviceProviders ?? 0)}
        hint={t("systemUsers.kpi.serviceProvidersHint")}
        accent="bg-amber-500/10 text-amber-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={HardHat}
        label={t("systemUsers.kpi.engineers")}
        value={String(stats?.engineers ?? 0)}
        hint={t("systemUsers.kpi.engineersHint")}
        accent="bg-primary/10 text-primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserKPISection;
