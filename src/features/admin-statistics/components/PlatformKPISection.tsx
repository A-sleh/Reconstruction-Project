import KpiCard from "@/components/shared/KpiCard";
import {
  Users,
  Package,
  Building2,
  ClipboardCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSystemUserStats } from "@/features/system-users/api/query";
import { useBankStat } from "@/features/category-bank/api/quertes";

const supportStats = {
  open_tickets: 12,
  pending_customer: 5,
  urgent_tickets: 3,
  resolved_today: 8,
};

const PlatformKPISection = () => {
  const { t } = useTranslation();
  const { data: userStats, isLoading: isUserStatsLoading } = useSystemUserStats();
  const { data: bankStat, isLoading: isBankStatLoading } = useBankStat();

  const isLoading = isUserStatsLoading || isBankStatLoading;

  const totalUsers = userStats
    ? userStats.investors +
      userStats.resourceProviders +
      userStats.serviceProviders +
      userStats.engineers
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        icon={Users}
        label={t("adminStatistics.kpi.totalUsers")}
        value={String(totalUsers)}
        hint={t("adminStatistics.kpi.totalUsersHint")}
        accent="bg-emerald-500/10 text-emerald-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Package}
        label={t("adminStatistics.kpi.totalResources")}
        value={String(bankStat?.totalResourcesBank ?? 0)}
        hint={t("adminStatistics.kpi.totalResourcesHint")}
        accent="bg-blue-500/10 text-blue-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Building2}
        label={t("adminStatistics.kpi.totalServices")}
        value={String(bankStat?.totalServicesBank ?? 0)}
        hint={t("adminStatistics.kpi.totalServicesHint")}
        accent="bg-indigo-500/10 text-indigo-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={ClipboardCheck}
        label={t("adminStatistics.kpi.pendingRequests")}
        value={String(bankStat?.totalUpcomingRequest ?? 0)}
        hint={t("adminStatistics.kpi.pendingRequestsHint")}
        accent="bg-amber-500/10 text-amber-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={Headphones}
        label={t("adminStatistics.kpi.openTickets")}
        value={String(supportStats.open_tickets)}
        hint={t("adminStatistics.kpi.openTicketsHint")}
        accent="bg-red-500/10 text-red-600"
        isLoading={isLoading}
      />
      <KpiCard
        icon={CheckCircle2}
        label={t("adminStatistics.kpi.resolvedToday")}
        value={String(supportStats.resolved_today)}
        hint={t("adminStatistics.kpi.resolvedTodayHint")}
        accent="bg-teal-500/10 text-teal-600"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PlatformKPISection;
