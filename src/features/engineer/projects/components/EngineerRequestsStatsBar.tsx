import { useTranslation } from "react-i18next";
import { Inbox, Send, BadgeCheck, XCircle } from "lucide-react";
import KpiCard from "@/components/shared/KpiCard";
import type { EngineerRequestsStats } from "../api/types";

interface EngineerRequestsStatsBarProps {
  stats: EngineerRequestsStats | undefined;
  isLoading: boolean;
}

const EngineerRequestsStatsBar = ({
  stats,
  isLoading,
}: EngineerRequestsStatsBarProps) => {
  const { t } = useTranslation();

  const acceptedCount =
    (stats?.invites.accepted ?? 0) + (stats?.requests.approved ?? 0);
  const declinedCount =
    (stats?.invites.declined ?? 0) + (stats?.requests.rejected ?? 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Inbox}
        label={t("engineerRequests.kpi.pendingInvites")}
        value={String(stats?.invites.pending ?? 0)}
        hint={t("engineerRequests.kpi.pendingInvitesHint")}
        accent="bg-amber-500/10 text-amber-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Send}
        label={t("engineerRequests.kpi.outgoingPending")}
        value={String(stats?.requests.pending ?? 0)}
        hint={t("engineerRequests.kpi.outgoingPendingHint")}
        accent="bg-primary/10 text-primary"
        isLoading={isLoading}
      />
      <KpiCard
        icon={BadgeCheck}
        label={t("engineerRequests.kpi.acceptedCount")}
        value={String(acceptedCount)}
        hint={t("engineerRequests.kpi.acceptedCountHint")}
        accent="bg-emerald-500/10 text-emerald-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={XCircle}
        label={t("engineerRequests.kpi.declinedCount")}
        value={String(declinedCount)}
        hint={t("engineerRequests.kpi.declinedCountHint")}
        accent="bg-rose-500/10 text-rose-600"
        isLoading={isLoading}
      />
    </div>
  );
};

export default EngineerRequestsStatsBar;
