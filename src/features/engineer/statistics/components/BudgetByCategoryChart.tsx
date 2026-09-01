import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EngineerStatistics } from "../api/types";

const BUDGET_COLOR = "hsl(170.46 100% 25%)";

interface BudgetByCategoryChartProps {
  stats: EngineerStatistics;
}

const BudgetByCategoryChart = ({ stats }: BudgetByCategoryChartProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const data = stats.budgetByCategory.map((item) => ({
    ...item,
    totalBudget: item.totalBudget / 1000000,
  }));

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("engineerStatistics.charts.budget.title")}
        </CardTitle>
        <CardDescription>
          {t("engineerStatistics.charts.budget.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="category"
              stroke="gray"
              fontSize={11}
              reversed={isRtl}
            />
            <YAxis
              stroke="gray"
              fontSize={11}
              orientation={isRtl ? "right" : "left"}
            />
            <Tooltip
              cursor={{ fill: "hsl(170.46 100% 25% / 0.06)" }}
              formatter={(value: number) => [
                `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`,
                t("engineerStatistics.charts.budget.value"),
              ]}
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <Bar
              dataKey="totalBudget"
              name={t("engineerStatistics.charts.budget.value")}
              fill={BUDGET_COLOR}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetByCategoryChart;