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
import { MOCK_USER_GROWTH } from "../mock/mockData";

const COLOR = "hsl(170.46 100% 25%)";

const UserGrowthChart = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.charts.userGrowth.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.charts.userGrowth.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_USER_GROWTH}>
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
              dataKey="count"
              stroke={COLOR}
              fill={COLOR}
              fillOpacity={0.15}
              strokeWidth={2}
              name={t("adminStatistics.charts.userGrowth.newUsers")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
