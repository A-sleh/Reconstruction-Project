import { useTranslation } from "react-i18next";
import { HardHat, Package } from "lucide-react";

import type { ProviderType } from "../api/types";
import { MOCK_RESOURCE_DASHBOARD, MOCK_SERVICE_DASHBOARD } from "../mock/data";
import DashboardCharts from "./DashboardCharts";
import DashboardInsights from "./DashboardInsights";
import DashboardKpiRow from "./DashboardKpiRow";

interface Props {
  providerType: ProviderType;
}

const ProjectItemsDashboard = ({ providerType }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const data =
    providerType === "Service"
      ? MOCK_SERVICE_DASHBOARD
      : MOCK_RESOURCE_DASHBOARD;

  const HeaderIcon = providerType === "Service" ? HardHat : Package;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HeaderIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            {t("project.dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("project.dashboard.subtitle")}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {t(`project.dashboard.providerNames.${providerType}`)}
        </span>
      </div>

      <DashboardKpiRow data={data} />
      <DashboardCharts data={data} />
      <DashboardInsights data={data} />
    </div>
  );
};

export default ProjectItemsDashboard;
