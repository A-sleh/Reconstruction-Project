import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fmtCurrency } from "@/lib/helpers";
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
import type { Order } from "@/features/orders/api/types";
import type { SiteStat } from "../api";

interface RevenueBySiteBarChartProps {
  orders: Order[];
  sites: SiteStat[];
}

const RevenueBySiteBarChart = ({
  orders,
  sites,
}: RevenueBySiteBarChartProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const chartData = sites
    .map((s) => ({
      name: s.name.length > 14 ? s.name.slice(0, 12) + "…" : s.name,
      revenue: Math.round(
        orders
          .filter(() => true)
          .reduce((sum) => sum, 0) / Math.max(sites.length, 1),
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const siteRevenueMap = new Map<number, number>();
  orders.forEach((o) => {
    const site = sites.find((s) => s.id === (o as unknown as { siteId?: number }).siteId);
    if (site) {
      siteRevenueMap.set(site.id, (siteRevenueMap.get(site.id) ?? 0) + o.netTotal);
    }
  });

  const hasSiteData = siteRevenueMap.size > 0;
  const data = hasSiteData
    ? sites
        .map((s) => ({
          name: s.name.length > 14 ? s.name.slice(0, 12) + "…" : s.name,
          revenue: Math.round(siteRevenueMap.get(s.id) ?? 0),
        }))
        .filter((d) => d.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8)
    : chartData;

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.revenueBySite.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.revenueBySite.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="gray"
              fontSize={11}
              reversed={isRtl}
            />
            <YAxis
              stroke="gray"
              fontSize={11}
              orientation={isRtl ? "right" : "left"}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
              formatter={(v: number) => [fmtCurrency(v), ""]}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(142 71% 45%)"
              barSize={50}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueBySiteBarChart;
