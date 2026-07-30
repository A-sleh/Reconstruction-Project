import KpiCard from "@/components/shared/KpiCard";
import { Building2, ClipboardCheck, FolderOpen, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBankStat } from "../api/quertes";

const BankCategoryKPISection = () => {
  const { t } = useTranslation();
  const { data: stat, isLoading } = useBankStat();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={FolderOpen}
        label={t("categoryBank.kpi.totalCategories")}
        value={String(stat?.totalResourcesBank ?? 0)}
        isLoading={isLoading}
        hint={t("categoryBank.kpi.totalCategoriesHint")}
        accent="bg-primary/10 text-primary"
      />
      <KpiCard
        icon={ClipboardCheck}
        label={t("categoryBank.kpi.pendingRequests")}
        value={String(stat?.totalUpcomingRequest ?? 0)}
        hint={t("categoryBank.kpi.pendingRequestsHint")}
        isLoading={isLoading}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={Package}
        label={t("categoryBank.kpi.totalResources")}
        value={String(stat?.totalResourcesBank ?? 0)}
        hint={t("categoryBank.kpi.totalResourcesHint")}
        isLoading={isLoading}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={Building2}
        label={t("categoryBank.kpi.serviceCategories")}
        value={String(stat?.totalServicesBank ?? 0)}
        hint={t("categoryBank.kpi.serviceCategoriesHint")}
        isLoading={isLoading}
        accent="bg-indigo-500/10 text-indigo-600"
      />
    </div>
  );
};

export default BankCategoryKPISection;
