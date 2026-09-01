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
import type { EngineerStatistics } from "../api/types";

const STARTED_COLOR = "hsl(170.46 100% 25%)";
const COMPLETED_COLOR = "hsl(160 84% 39%)";

interface ProjectsTrendChartProps {
  stats: EngineerStatistics;
}

const ProjectsTrendChart = ({ stats }: ProjectsTrendChartProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("engineerStatistics.charts.trend.title")}
        </CardTitle>
        <CardDescription>
          {t("engineerStatistics.charts.trend.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.monthlyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              stroke="gray"
              fontSize={11}
              reversed={isRtl}
            />
            <YAxis
              stroke="gray"
              fontSize={11}
              orientation={isRtl ? "right" : "left"}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <Area
              type="monotone"
              dataKey="started"
              stroke={STARTED_COLOR}
              fill={STARTED_COLOR}
              fillOpacity={0.15}
              strokeWidth={2}
              name={t("engineerStatistics.charts.trend.started")}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke={COMPLETED_COLOR}
              fill={COMPLETED_COLOR}
              fillOpacity={0.15}
              strokeWidth={2}
              name={t("engineerStatistics.charts.trend.completed")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectsTrendChart;
