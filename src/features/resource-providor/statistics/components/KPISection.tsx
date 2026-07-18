import KpiCard from "@/components/shared/KpiCard";
import { Boxes, Building2, DollarSign, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useResourceProvidorStat } from "../api/query";

// Simple formatter fallback if not imported elsewhere
const fmtCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

interface KPISectionProps {
  sites: number;
  requests: number;
  resources: number;
}

const KPISection: React.FC<KPISectionProps> = ({
  sites,
  requests,
  resources,
}) => {
  const { t } = useTranslation();
  const { isLoading, data: stat, isError } = useResourceProvidorStat();

  // Loading skeleton block
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  // Error block
  if (isError) {
    return (
      <div className="text-sm text-destructive">
        {t("resourceProvidor.statistics.errorMessage")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Building2}
        label={t("resourceProvidor.statistics.workSites")}
        value={String(sites)}
        hint={t("resourceProvidor.statistics.avgProgress", {
          progress: stat?.avgProgress ?? 0,
        })}
      />
      <KpiCard
        icon={Boxes}
        label={t("resourceProvidor.statistics.inventoryValue")}
        value={fmtCurrency(stat?.totalInventoryValue ?? 0)}
        hint={t("resourceProvidor.statistics.inventoryHint", {
          count: resources,
          lowStock: stat?.lowStock ?? 0,
        })}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={Inbox}
        label={t("resourceProvidor.statistics.investorRequests")}
        value={String(requests)}
        hint={t("resourceProvidor.statistics.fulfilled", {
          rate: stat?.fulfillmentRate ?? 0,
        })}
        accent="bg-indigo-500/10 text-indigo-600"
      />
      <KpiCard
        icon={DollarSign}
        label={t("resourceProvidor.statistics.totalInvoiced")}
        value={fmtCurrency(stat?.totalInvoiced ?? 0)}
        hint={t("resourceProvidor.statistics.pendingOrders", {
          count: stat?.pendingOrders ?? 0,
        })}
        accent="bg-amber-500/10 text-amber-600"
      />
    </div>
  );
};

export default KPISection;
