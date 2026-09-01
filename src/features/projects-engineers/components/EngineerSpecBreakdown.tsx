import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
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

export interface SpecEntry {
  name: string;
  count: number;
}

interface Props {
  data: SpecEntry[];
  isArabic: boolean;
}

const EngineerSpecBreakdown = ({ data, isArabic }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t(
            "projectsEngineers.dashboard.charts.specBreakdown",
            "Engineers by Specialty",
          )}
        </CardTitle>
        <CardDescription>
          {t(
            "projectsEngineers.dashboard.charts.specBreakdownDesc",
            "Engineers roster grouped by specialization.",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              stroke="gray"
              fontSize={10}
              interval={0}
              angle={isArabic ? -15 : 15}
              textAnchor="end"
              height={50}
              reversed={isArabic}
            />
            <YAxis
              stroke="gray"
              fontSize={11}
              orientation={isArabic ? "right" : "left"}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isArabic ? "right" : "left",
              }}
            />
            <Bar
              dataKey="count"
              fill="hsl(38 92% 50%)"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EngineerSpecBreakdown;