import { useTranslation } from "react-i18next";
import { CheckCircle2, DollarSign, Package, TrendingUp } from "lucide-react";

import KpiCard from "@/components/shared/KpiCard";

import type { ProviderDashboardData } from "../api/types";

interface Props {
  data: ProviderDashboardData;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const DashboardKpiRow = ({ data }: Props) => {
  const { t } = useTranslation();
  const { kpi } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Package}
        label={t("project.dashboard.kpi.totalOrders")}
        value={String(kpi.totalOrders)}
        hint={`${kpi.completedOrders} ${t("project.dashboard.kpi.completed")}`}
        accent="bg-primary/10 text-primary"
      />
      <KpiCard
        icon={DollarSign}
        label={t("project.dashboard.kpi.netSpend")}
        value={fmt(kpi.netSpend)}
        hint={`${fmt(kpi.totalDiscount)} ${t("project.dashboard.kpi.discount")}`}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={TrendingUp}
        label={t("project.dashboard.kpi.fulfillRate")}
        value={`${kpi.avgFulfillRate}%`}
        hint={`${kpi.preparingOrders} ${t("project.dashboard.kpi.preparing")}`}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={CheckCircle2}
        label={t("project.dashboard.kpi.availableItems")}
        value={String(kpi.availableItems)}
        hint={`${kpi.totalItems} ${t("project.dashboard.kpi.ofTotal")}`}
        accent="bg-indigo-500/10 text-indigo-600"
      />
    </div>
  );
};

export default DashboardKpiRow;
