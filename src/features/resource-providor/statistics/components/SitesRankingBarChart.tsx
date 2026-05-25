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

interface SitesRankingBarChartProps {
  siteValue: { name: string; value: number }[];
}

const SitesRankingBarChart = ({ siteValue }: SitesRankingBarChartProps) => {
  const { t, i18n } = useTranslation();

  // Detect current language direction for RTL mirroring support
  const isRtl = i18n.dir() === "rtl";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={siteValue}>
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
              dataKey="value"
              fill="#054239"
              // CHANGED: Use barSize instead of width to set custom bar thickness in pixels
              barSize={60} 
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SitesRankingBarChart;