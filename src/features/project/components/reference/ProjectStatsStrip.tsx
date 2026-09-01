import {
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import KpiCard from "@/components/shared/KpiCard";
import { fmtCurrency } from "@/lib/helpers";
import type { ProjectStatistics } from "../../api/types";

const ProjectStatsStrip = ({
  statistics,
}: {
  statistics?: ProjectStatistics;
}) => {
  const { t } = useTranslation();

  if (!statistics) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        icon={Wrench}
        value={String(statistics.totalWorkshops)}
        accent="bg-primary/10 text-primary"
        label={t("project.details.reference.statistics.workshops")}
        isLoading={false}
      />
      <KpiCard
        icon={Users}
        value={String(statistics.totalMembers)}
        accent="bg-indigo-500/10 text-indigo-600"
        label={t("project.details.reference.statistics.members")}
        isLoading={false}
      />
      <KpiCard
        icon={ClipboardList}
        value={String(statistics.totalOrders)}
        accent="bg-violet-500/10 text-violet-600"
        label={t("project.details.reference.statistics.orders")}
        isLoading={false}
      />
      <KpiCard
        icon={Wallet}
        value={fmtCurrency(statistics.totalPayments)}
        accent="bg-sky-500/10 text-sky-600"
        label={t("project.details.reference.statistics.totalPayments")}
        isLoading={false}
      />
      <KpiCard
        icon={CheckCircle2}
        value={fmtCurrency(statistics.totalPaid)}
        accent="bg-emerald-500/10 text-emerald-600"
        label={t("project.details.reference.statistics.paid")}
        isLoading={false}
      />
      <KpiCard
        icon={TrendingUp}
        value={fmtCurrency(statistics.remainingPayments)}
        accent="bg-gold/10 text-gold"
        label={t("project.details.reference.statistics.remaining")}
        isLoading={false}
      />
    </div>
  );
};

export default ProjectStatsStrip;
