import KpiCard from "@/components/shared/KpiCard";
import { FolderOpen, ClipboardCheck, Package, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BankCategoryKPISectionProps {
  totalCategories: number;
  pendingRequests: number;
  totalResources: number;
  serviceCategories: number;
}

const BankCategoryKPISection: React.FC<BankCategoryKPISectionProps> = ({
  totalCategories,
  pendingRequests,
  totalResources,
  serviceCategories,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={FolderOpen}
        label={t("categoryBank.kpi.totalCategories")}
        value={String(totalCategories)}
        hint={t("categoryBank.kpi.totalCategoriesHint")}
        accent="bg-primary/10 text-primary"
      />
      <KpiCard
        icon={ClipboardCheck}
        label={t("categoryBank.kpi.pendingRequests")}
        value={String(pendingRequests)}
        hint={t("categoryBank.kpi.pendingRequestsHint")}
        accent="bg-amber-500/10 text-amber-600"
      />
      <KpiCard
        icon={Package}
        label={t("categoryBank.kpi.totalResources")}
        value={String(totalResources)}
        hint={t("categoryBank.kpi.totalResourcesHint")}
        accent="bg-emerald-500/10 text-emerald-600"
      />
      <KpiCard
        icon={Building2}
        label={t("categoryBank.kpi.serviceCategories")}
        value={String(serviceCategories)}
        hint={t("categoryBank.kpi.serviceCategoriesHint")}
        accent="bg-indigo-500/10 text-indigo-600"
      />
    </div>
  );
};

export default BankCategoryKPISection;
