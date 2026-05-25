import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
// Fixed imports: Sourced clean roots to avoid development environment build crashes
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(var(--muted-foreground))",
  partial: "hsl(38 92% 50%)",
  completed: "hsl(142 71% 45%)",
  rejected: "hsl(0 84% 60%)",
};

interface InvestorRequestPieChartProps {
  requestStatus: { name: string; value: number }[];
}

const InvestorRequestPieChart = ({
  requestStatus,
}: InvestorRequestPieChartProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  // Map incoming data keys to their localized descriptive terms for the chart & legend
  const translatedData = requestStatus.map((item) => ({
    ...item,
    // Safely falls back to the original key name if it is not present in the locale dictionary
    name: t(
      `resourceProvidor.statistics.charts.pieChart.statuses.${item.name}`,
      {
        defaultValue: item.name,
      },
    ),
    color: item.name,
  }));

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.pieChart.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.pieChart.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              dataKey="value"
              nameKey="name" // Uses the translated label string
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >
              {translatedData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.color] || "hsl(var(--muted))"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
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
  );
};

export default InvestorRequestPieChart;
