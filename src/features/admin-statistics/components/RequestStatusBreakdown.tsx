import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS: Record<string, string> = {
  accepted: "hsl(160 84% 39%)",
  pending: "hsl(38 92% 50%)",
  rejected: "hsl(0 84% 60%)",
  resolved: "hsl(170.46 100% 25%)",
};

const STATUS_KEYS = ["accepted", "pending", "rejected", "resolved"] as const;

interface RequestStatusBreakdownProps {
  accepted: number;
  pending: number;
  rejected: number;
  resolved: number;
}

const RequestStatusBreakdown = ({
  accepted,
  pending,
  rejected,
  resolved,
}: RequestStatusBreakdownProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const values: Record<(typeof STATUS_KEYS)[number], number> = {
    accepted,
    pending,
    rejected,
    resolved,
  };

  const data = [
    {
      name: t("adminStatistics.charts.requestStatus.title"),
      ...values,
    },
  ];

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.charts.requestStatus.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.charts.requestStatus.description")}
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
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <Legend
              direction={isRtl ? "rtl" : "ltr"}
              wrapperStyle={{ direction: isRtl ? "rtl" : "ltr" }}
            />
            {STATUS_KEYS.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={t(`adminStatistics.charts.requestStatus.${key}`)}
                fill={COLORS[key]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RequestStatusBreakdown;
