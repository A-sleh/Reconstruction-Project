import KpiCard from "@/components/shared/KpiCard";
import { Users, Clock, BadgeCheck, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { EngineerVerificationStats } from "../api/types";

interface EngineerStatsBarProps {
  stats: EngineerVerificationStats;
  isLoading?: boolean;
}

const EngineerStatsBar = ({
  stats,
  isLoading = false,
}: EngineerStatsBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Clock}
        label={t("engineerVerification.kpi.pending")}
        value={String(stats?.pending ?? 0)}
        hint={t("engineerVerification.kpi.pendingHint")}
        accent="bg-amber-500/10 text-amber-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={BadgeCheck}
        label={t("engineerVerification.kpi.verified")}
        value={String(stats?.verified ?? 0)}
        hint={t("engineerVerification.kpi.verifiedHint")}
        accent="bg-emerald-500/10 text-emerald-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={XCircle}
        label={t("engineerVerification.kpi.rejected")}
        value={String(stats?.rejected ?? 0)}
        hint={t("engineerVerification.kpi.rejectedHint")}
        accent="bg-rose-500/10 text-rose-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Users}
        label={t("engineerVerification.kpi.total")}
        value={String(stats?.total ?? 0)}
        hint={t("engineerVerification.kpi.totalHint")}
        accent="bg-primary/10 text-primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default EngineerStatsBar;
