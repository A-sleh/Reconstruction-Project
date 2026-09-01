import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ProviderDashboardData } from "../api/types";

interface Props {
  data: ProviderDashboardData;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const ORDER_STATUS_COLORS: Record<string, string> = {
  Completed: "hsl(142 71% 45%)",
  Preparing: "hsl(38 92% 50%)",
  PendingApproval: "hsl(var(--muted-foreground))",
  PendingToApproveCancellation: "hsl(0 84% 60%)",
  Cancelled: "hsl(0 60% 50%)",
  Suspended: "hsl(220 9% 46%)",
};

const DashboardCharts = ({ data }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const orderStatusData = data.statusDistribution.map((s) => ({
    name: t(`project.dashboard.charts.orderStatusLabels.${s.status}`),
    value: s.count,
    key: s.status,
  }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.dashboard.charts.orderStatus")}
            </CardTitle>
            <CardDescription>
              {t("project.dashboard.charts.orderStatusDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {orderStatusData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        ORDER_STATUS_COLORS[entry.key] ||
                        "hsl(var(--muted))"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Legend
                  direction={isArabic ? "rtl" : "ltr"}
                  wrapperStyle={{ direction: isArabic ? "rtl" : "ltr" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("project.dashboard.charts.categories")}
            </CardTitle>
            <CardDescription>
              {t("project.dashboard.charts.categoriesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryBreakdown}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  fontSize={10}
                  reversed={isArabic}
                />
                <YAxis
                  stroke="gray"
                  fontSize={11}
                  orientation={isArabic ? "right" : "left"}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    textAlign: isArabic ? "right" : "left",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  barSize={40}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("project.dashboard.charts.monthlyTimeline")}
          </CardTitle>
          <CardDescription>
            {t("project.dashboard.charts.monthlyTimelineDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyTimeline}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                stroke="gray"
                fontSize={11}
                reversed={isArabic}
              />
              <YAxis
                stroke="gray"
                fontSize={11}
                orientation={isArabic ? "right" : "left"}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  textAlign: isArabic ? "right" : "left",
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name={t("project.dashboard.charts.orders")}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.15)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("project.dashboard.charts.topItems")}
          </CardTitle>
          <CardDescription>
            {t("project.dashboard.charts.topItemsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-2 font-medium">
                  {t("project.dashboard.charts.topItemsCols.name")}
                </th>
                <th className="py-2 pr-2 font-medium">
                  {t("project.dashboard.charts.topItemsCols.category")}
                </th>
                <th className="py-2 pr-2 font-medium">
                  {t("project.dashboard.charts.topItemsCols.qty")}
                </th>
                <th className="py-2 pr-2 text-right font-medium">
                  {t("project.dashboard.charts.topItemsCols.amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.topItems.map((item) => (
                <tr key={item.name} className="border-b">
                  <td className="py-2 pr-2 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="py-2 pr-2 text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="py-2 pr-2 text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-2 pr-2 text-right text-foreground">
                    {fmt(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
