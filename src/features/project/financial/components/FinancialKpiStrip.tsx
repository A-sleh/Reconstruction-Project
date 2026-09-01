import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KpiCard from "@/components/shared/KpiCard";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { Banknote, Briefcase, CheckCircle2, HandCoins, PieChart, TrendingUp, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fmtCurrency } from "@/lib/helpers";
import type { ProjectFinancialSummary } from "../api/types";

interface FinancialKpiStripProps {
  summary: ProjectFinancialSummary;
  isLoading?: boolean;
}

const FinancialKpiStrip = ({ summary, isLoading = false }: FinancialKpiStripProps) => {
  const { t, i18n } = useTranslation();

  return (
    <div dir={i18n.dir()} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          icon={Wallet}
          label={t("project.financial.kpi.totalPayments")}
          value={fmtCurrency(summary.totalPayments)}
          accent="bg-primary/10 text-primary"
          isLoading={isLoading}
        />
        <KpiCard
          icon={CheckCircle2}
          label={t("project.financial.kpi.totalPaid")}
          value={fmtCurrency(summary.totalPaid)}
          accent="bg-emerald-500/10 text-emerald-600"
          isLoading={isLoading}
        />
        <KpiCard
          icon={TrendingUp}
          label={t("project.financial.kpi.remainingPayments")}
          value={fmtCurrency(summary.remainingPayments)}
          accent="bg-gold/10 text-gold"
          isLoading={isLoading}
        />
        <KpiCard
          icon={Briefcase}
          label={t("project.financial.kpi.workshopBudget")}
          value={fmtCurrency(summary.totalWorkshopBudget)}
          accent="bg-indigo-500/10 text-indigo-600"
          isLoading={isLoading}
        />
        <KpiCard
          icon={HandCoins}
          label={t("project.financial.kpi.workshopPaid")}
          value={fmtCurrency(summary.totalWorkshopPaid)}
          accent="bg-sky-500/10 text-sky-600"
          isLoading={isLoading}
        />
        <KpiCard
          icon={Banknote}
          label={t("project.financial.kpi.workshopRemaining")}
          value={fmtCurrency(summary.totalWorkshopRemaining)}
          accent="bg-violet-500/10 text-violet-600"
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">
              {t("project.financial.budgetUtilization.title")}
            </CardTitle>
            <CardDescription>
              {t("project.financial.budgetUtilization.subtitle")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <>
              <Progress value={summary.budgetUtilization} className="h-3" />
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {t("project.financial.budgetUtilization.paid")}{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {fmtCurrency(summary.totalWorkshopPaid)}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                  {t("project.financial.budgetUtilization.required")}{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {fmtCurrency(summary.totalWorkshopBudget)}
                  </span>
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialKpiStrip;
