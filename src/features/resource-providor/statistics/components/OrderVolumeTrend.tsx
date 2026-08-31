import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Order } from "@/features/orders/api/types";

const COLORS = {
  count: "hsl(210 80% 50%)",
  revenue: "hsl(142 71% 45%)",
};

interface OrderVolumeTrendProps {
  orders: Order[];
}

const OrderVolumeTrend = ({ orders }: OrderVolumeTrendProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const chartData = (() => {
    const grouped = new Map<
      string,
      { count: number; revenue: number; label: string }
    >();

    orders.forEach((o) => {
      const d = new Date(o.requestedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const existing = grouped.get(key);
      const label = d.toLocaleDateString(isRtl ? "ar-SY" : "en-US", {
        month: "short",
        year: "2-digit",
      });
      if (existing) {
        existing.count += 1;
        existing.revenue += o.netTotal;
      } else {
        grouped.set(key, { count: 1, revenue: o.netTotal, label });
      }
    });

    return Array.from(grouped.values())
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((g) => ({
        name: g.label,
        orders: g.count,
        revenue: Math.round(g.revenue),
      }));
  })();

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.orderVolume.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.orderVolume.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="gray"
              fontSize={11}
              reversed={isRtl}
            />
            <YAxis
              yAxisId="left"
              stroke="gray"
              fontSize={11}
              orientation={isRtl ? "right" : "left"}
            />
            <YAxis yAxisId="right" orientation={isRtl ? "left" : "right"} hide />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              stroke={COLORS.count}
              fill={COLORS.count}
              fillOpacity={0.15}
              strokeWidth={2}
              name={t("resourceProvidor.statistics.charts.orderVolume.orders")}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.revenue}
              fill={COLORS.revenue}
              fillOpacity={0.1}
              strokeWidth={2}
              name={t("resourceProvidor.statistics.charts.orderVolume.revenue")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrderVolumeTrend;
