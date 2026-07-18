import KpiCard from "@/components/shared/KpiCard";
import { Building2, HardHat, Truck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserKPISectionProps {
  investors: number;
  resourceProviders: number;
  serviceProviders: number;
  engineers: number;
}

const UserKPISection: React.FC<UserKPISectionProps> = ({
  investors,
  resourceProviders,
  serviceProviders,
  engineers,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Users}
        label={t("systemUsers.kpi.investors")}
        value={String(investors)}
        hint={t("systemUsers.kpi.investorsHint")}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={Truck}
        label={t("systemUsers.kpi.resourceProviders")}
        value={String(resourceProviders)}
        hint={t("systemUsers.kpi.resourceProvidersHint")}
        accent="bg-indigo-500/10 text-indigo-600"
      />
      <KpiCard
        icon={Building2}
        label={t("systemUsers.kpi.serviceProviders")}
        value={String(serviceProviders)}
        hint={t("systemUsers.kpi.serviceProvidersHint")}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={HardHat}
        label={t("systemUsers.kpi.engineers")}
        value={String(engineers)}
        hint={t("systemUsers.kpi.engineersHint")}
        accent="bg-primary/10 text-primary"
      />
    </div>
  );
};

export default UserKPISection;
