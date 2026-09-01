import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

export interface TopEngineerEntry {
  name: string;
  count: number;
}

interface Props {
  data: TopEngineerEntry[];
  isArabic: boolean;
}

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(142 71% 45%)",
  "hsl(262 83% 58%)",
];

const TopEngineersChart = ({ data, isArabic }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t(
            "projectsEngineers.dashboard.charts.topEngineers",
            "Top Engineers",
          )}
        </CardTitle>
        <CardDescription>
          {t(
            "projectsEngineers.dashboard.charts.topEngineersDesc",
            "Engineers with the most recorded actions.",
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
              angle={isArabic ? -20 : 20}
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
            <Bar dataKey="count" barSize={40} radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopEngineersChart;