import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { ProjectStatistics } from "../../api/types";
import { useProjectFinancials } from "../api/queries";
import type {
  ProjectTransaction,
  TransactionCategory,
} from "../api/types";
import FinancialHeader from "./FinancialHeader";
import QuickActions from "./QuickActions";
import FinancialKpiStrip from "./FinancialKpiStrip";
import WorkshopBudgetBars from "./WorkshopBudgetBars";
import BudgetByCategoryDonut from "./BudgetByCategoryDonut";
import CashFlowChart from "./CashFlowChart";
import TransactionLedger from "./TransactionLedger";
import ProvidersPanel from "./ProvidersPanel";
import WorkshopsPanel from "./WorkshopsPanel";
import EngineersPanel from "./EngineersPanel";

export default function ProjectFinancialSection({
  projectId,
  statistics,
  onNavigate,
}: {
  projectId: number;
  statistics?: ProjectStatistics;
  onNavigate: (key: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const financials = useProjectFinancials({ projectId, statistics });

  const providerTx = useMemo<ProjectTransaction[]>(
    () => {
      const providerCategories: TransactionCategory[] = [
        "provider-resource",
        "provider-service",
      ];
      return financials.ledger.filter((tx) =>
        providerCategories.includes(tx.category),
      );
    },
    [financials.ledger],
  );

  return (
    <div className="space-y-6" dir={i18n.dir()}>
      <FinancialHeader />

      <QuickActions onNavigate={onNavigate} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="overview">
            {t("project.financial.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="providers">
            {t("project.financial.tabs.providers")}
          </TabsTrigger>
          <TabsTrigger value="workshops">
            {t("project.financial.tabs.workshops")}
          </TabsTrigger>
          <TabsTrigger value="engineers">
            {t("project.financial.tabs.engineers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <FinancialKpiStrip
            summary={financials.summary}
            isLoading={financials.isLoading}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <WorkshopBudgetBars
              items={financials.workshopBudgets}
              isLoading={financials.isLoading}
            />
            <BudgetByCategoryDonut
              data={financials.categoryShares}
              sample
            />
          </div>
          <CashFlowChart data={financials.cashFlow} sample />
          <TransactionLedger transactions={financials.ledger} />
        </TabsContent>

        <TabsContent value="providers" className="space-y-6 pt-4">
          <ProvidersPanel
            transactions={providerTx}
            onNavigate={onNavigate}
          />
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6 pt-4">
          <WorkshopsPanel
            items={financials.workshopBudgets}
            isLoading={financials.isLoading}
          />
        </TabsContent>

        <TabsContent value="engineers" className="space-y-6 pt-4">
          <EngineersPanel totalMembers={statistics?.totalMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
