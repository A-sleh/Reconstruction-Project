import { BarChart3, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { fmtCurrency } from "@/lib/helpers";
import type { WorkshopBudgetItem } from "../api/types";

const PAID_COLOR = "hsl(142 71% 45%)";
const REQUIRED_COLOR = "hsl(var(--muted))";

interface WorkshopBudgetBarsProps {
  items: WorkshopBudgetItem[];
  isLoading?: boolean;
}

const WorkshopBudgetBars = ({ items, isLoading = false }: WorkshopBudgetBarsProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <Card dir={i18n.dir()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t("project.financial.charts.workshopBudget")}
        </CardTitle>
        <CardDescription>
          {t("project.financial.charts.workshopBudgetDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading && items.length === 0 ? (
          <Skeleton className="h-full w-full" />
        ) : !isLoading && items.length === 0 ? (
          <EmptyState icon={Wrench} message={t("project.financial.ledger.empty")} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="workshopName"
                stroke="gray"
                fontSize={11}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
                reversed={isRtl}
              />
              <YAxis
                stroke="gray"
                fontSize={11}
                orientation={isRtl ? "right" : "left"}
                tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  textAlign: isRtl ? "right" : "left",
                }}
                formatter={(value) => [fmtCurrency(Number(value)), ""]}
              />
              <Legend />
              <Bar
                dataKey="paid"
                name={t("project.financial.budgetUtilization.paid")}
                fill={PAID_COLOR}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="required"
                name={t("project.financial.budgetUtilization.required")}
                fill={REQUIRED_COLOR}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkshopBudgetBars;
