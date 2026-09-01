import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
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

export interface TimelineEntry {
  day: string;
  count: number;
}

interface Props {
  data: TimelineEntry[];
  isArabic: boolean;
}

const ActionsTimelineChart = ({ data, isArabic }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t(
            "projectsEngineers.dashboard.charts.timeline",
            "Activity Timeline",
          )}
        </CardTitle>
        <CardDescription>
          {t(
            "projectsEngineers.dashboard.charts.timelineDesc",
            "Number of engineer actions per day.",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="day"
              stroke="gray"
              fontSize={11}
              reversed={isArabic}
            />
            <YAxis
              stroke="gray"
              fontSize={11}
              orientation={isArabic ? "right" : "left"}
              allowDecimals={false}
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
              dataKey="count"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.15)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ActionsTimelineChart;