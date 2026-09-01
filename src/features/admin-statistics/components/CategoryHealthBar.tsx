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
  resources: "hsl(160 84% 39%)",
  services: "hsl(235 50% 55%)",
};

interface CategoryHealthBarProps {
  resourceCategories: number;
  serviceCategories: number;
}

const CategoryHealthBar = ({
  resourceCategories,
  serviceCategories,
}: CategoryHealthBarProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const data = [
    {
      name: t("adminStatistics.charts.categoryHealth.resources"),
      resources: resourceCategories,
      key: "resources",
    },
    {
      name: t("adminStatistics.charts.categoryHealth.services"),
      services: serviceCategories,
      key: "services",
    },
  ];

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.charts.categoryHealth.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.charts.categoryHealth.description")}
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
            <Bar
              dataKey="resources"
              name={t("adminStatistics.charts.categoryHealth.resources")}
              fill={COLORS.resources}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="services"
              name={t("adminStatistics.charts.categoryHealth.services")}
              fill={COLORS.services}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryHealthBar;
