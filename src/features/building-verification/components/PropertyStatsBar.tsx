import { useTranslation } from "react-i18next";
import { Clock, BadgeCheck, XCircle, Building2 } from "lucide-react";
import KpiCard from "@/components/shared/KpiCard";
import type { PropertyVerificationStats } from "../api/types";

interface PropertyStatsBarProps {
  stats: PropertyVerificationStats | undefined;
  isLoading: boolean;
}

const PropertyStatsBar = ({
  stats,
  isLoading,
}: PropertyStatsBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Clock}
        label={t("buildingVerification.kpi.pending")}
        value={String(stats?.pending ?? 0)}
        hint={t("buildingVerification.kpi.pendingHint")}
        accent="bg-amber-500/10 text-amber-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={BadgeCheck}
        label={t("buildingVerification.kpi.approved")}
        value={String(stats?.approved ?? 0)}
        hint={t("buildingVerification.kpi.approvedHint")}
        accent="bg-emerald-500/10 text-emerald-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={XCircle}
        label={t("buildingVerification.kpi.rejected")}
        value={String(stats?.rejected ?? 0)}
        hint={t("buildingVerification.kpi.rejectedHint")}
        accent="bg-rose-500/10 text-rose-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Building2}
        label={t("buildingVerification.kpi.total")}
        value={String(stats?.total ?? 0)}
        hint={t("buildingVerification.kpi.totalHint")}
        accent="bg-primary/10 text-primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PropertyStatsBar;
