import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { fmtCurrency } from "@/lib/helpers";
import { ChartNoAxesCombined, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CashFlowPoint } from "../api/types";

const INCOME_COLOR = "hsl(142 71% 45%)";
const EXPENSE_COLOR = "hsl(0 75% 50%)";

interface CashFlowChartProps {
  data: CashFlowPoint[];
  sample?: boolean;
}

const CashFlowChart = ({ data, sample = false }: CashFlowChartProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const formatMonth = (month: number) =>
    new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-SY" : "en-US", {
      month: "short",
    }).format(new Date(2026, month));

  return (
    <Card dir={i18n.dir()}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("project.financial.charts.cashFlow")}
          </CardTitle>
          <CardDescription>
            {t("project.financial.charts.cashFlowDesc")}
          </CardDescription>
        </div>
        {sample && (
          <Badge variant="outline">
            {t("project.financial.sampleData")}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <EmptyState
            icon={ChartNoAxesCombined}
            message={t("project.financial.ledger.empty")}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="cashIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={INCOME_COLOR} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={INCOME_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cashExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EXPENSE_COLOR} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={EXPENSE_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
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
                contentStyle={{
                  background: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  textAlign: isRtl ? "right" : "left",
                }}
                formatter={(value) => [fmtCurrency(Number(value)), ""]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                name={t("project.financial.charts.income")}
                stroke={INCOME_COLOR}
                fill="url(#cashIncomeGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name={t("project.financial.charts.expense")}
                stroke={EXPENSE_COLOR}
                fill="url(#cashExpenseGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;
