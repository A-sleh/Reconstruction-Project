import KpiCard from "@/components/shared/KpiCard";
import {
  AlertTriangle,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Order } from "@/features/orders/api/types";
import type { ResourceProvidorStat, ResourceStat } from "../api";

const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

interface KPISectionProps {
  sites: number;
  avgProgress: number;
  orders: Order[];
  resources: ResourceStat[];
  stat: ResourceProvidorStat;
}

const KPISection = ({
  sites,
  avgProgress,
  orders,
  resources,
  stat,
}: KPISectionProps) => {
  const { t } = useTranslation();

  const orderStats = (() => {
    const totalRevenue = orders.reduce((s, o) => s + o.netTotal, 0);
    const totalGross = orders.reduce((s, o) => s + o.totalPrice, 0);
    const avgFulfill =
      orders.length > 0
        ? Math.round(
            orders.reduce((s, o) => s + o.fulfillRate, 0) / orders.length,
          )
        : 0;
    const pendingOrders = orders.filter(
      (o) => o.status === "PendingApproval",
    );
    const pendingValue = pendingOrders.reduce((s, o) => s + o.netTotal, 0);
    return {
      totalRevenue,
      totalGross,
      avgFulfill,
      pendingCount: pendingOrders.length,
      pendingValue,
    };
  })();

  const lowStockCount = resources.filter(
    (r) => r.availability !== "in-stock",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        icon={Building2}
        label={t("resourceProvidor.statistics.workSites")}
        value={String(sites)}
        hint={t("resourceProvidor.statistics.avgProgress", {
          progress: stat.avgProgress ?? avgProgress,
        })}
      />
      <KpiCard
        icon={Boxes}
        label={t("resourceProvidor.statistics.inventoryValue")}
        value={fmtCurrency(stat.totalInventoryValue)}
        hint={t("resourceProvidor.statistics.inventoryHint", {
          count: resources.length,
          lowStock: stat.lowStock ?? lowStockCount,
        })}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={TrendingUp}
        label={t("resourceProvidor.statistics.totalRevenue")}
        value={fmtCurrency(orderStats.totalRevenue)}
        hint={t("resourceProvidor.statistics.grossRevenue", {
          value: fmtCurrency(orderStats.totalGross),
        })}
        accent="bg-blue-500/10 text-blue-600"
      />
      <KpiCard
        icon={CheckCircle2}
        label={t("resourceProvidor.statistics.fulfillmentRate")}
        value={`${orderStats.avgFulfill}%`}
        hint={t("resourceProvidor.statistics.ofOrders", {
          count: orders.length,
        })}
        accent="bg-indigo-500/10 text-indigo-600"
      />
      <KpiCard
        icon={Clock}
        label={t("resourceProvidor.statistics.pendingOrders")}
        value={String(orderStats.pendingCount)}
        hint={t("resourceProvidor.statistics.pendingValue", {
          value: fmtCurrency(orderStats.pendingValue),
        })}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={AlertTriangle}
        label={t("resourceProvidor.statistics.lowStockItems")}
        value={String(lowStockCount)}
        hint={t("resourceProvidor.statistics.ofTotal", {
          count: resources.length,
        })}
        accent="bg-red-500/10 text-red-600"
      />
    </div>
  );
};

export default KPISection;
