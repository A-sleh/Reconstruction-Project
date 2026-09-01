import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { fmtCurrency } from "@/lib/helpers";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import type { CategoryShareItem, TransactionCategory } from "../api/types";

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  "workshop": "hsl(170.46 100% 25%)",
  "provider-resource": "hsl(199 89% 48%)",
  "provider-service": "hsl(142 71% 45%)",
  "engineer": "hsl(262 83% 58%)",
  "other": "hsl(38 92% 50%)",
};

interface BudgetByCategoryDonutProps {
  data: CategoryShareItem[];
  sample?: boolean;
}

const BudgetByCategoryDonut = ({ data, sample = false }: BudgetByCategoryDonutProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card dir={i18n.dir()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-primary" />
              {t("project.financial.charts.categoryShare")}
            </CardTitle>
            <CardDescription>
              {t("project.financial.charts.categoryShareDesc")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState message={t("project.financial.ledger.empty")} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card dir={i18n.dir()}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChart className="h-5 w-5 text-primary" />
            {t("project.financial.charts.categoryShare")}
          </CardTitle>
          <CardDescription>
            {t("project.financial.charts.categoryShareDesc")}
          </CardDescription>
        </div>
        {sample && <Badge variant="outline">{t("project.financial.sampleData")}</Badge>}
      </CardHeader>
      <CardContent className="h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
              formatter={(value) => [fmtCurrency(Number(value)), ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">{fmtCurrency(total)}</p>
            <p className="text-xs text-muted-foreground">
              {t("project.financial.kpi.remainingPayments")}
            </p>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-2.5 w-2.5" viewBox="0 0 10 10">
                  <circle cx="5" cy="5" r="5" fill={CATEGORY_COLORS[item.category]} />
                </svg>
                {t(`project.financial.categories.${item.category}`)}
              </span>
              <span className="font-semibold tabular-nums">
                {fmtCurrency(item.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default BudgetByCategoryDonut;
