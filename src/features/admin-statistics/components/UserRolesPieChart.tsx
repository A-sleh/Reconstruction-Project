import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ROLE_COLORS: Record<string, string> = {
  investors: "hsl(142 71% 45%)",
  resourceProviders: "hsl(210 80% 50%)",
  serviceProviders: "hsl(38 92% 50%)",
  engineers: "hsl(170 100% 25%)",
};

interface UserRolesPieChartProps {
  investors: number;
  resourceProviders: number;
  serviceProviders: number;
  engineers: number;
}

const UserRolesPieChart = ({
  investors,
  resourceProviders,
  serviceProviders,
  engineers,
}: UserRolesPieChartProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const data = [
    {
      name: t("systemUsers.kpi.investors"),
      value: investors,
      key: "investors",
    },
    {
      name: t("systemUsers.kpi.resourceProviders"),
      value: resourceProviders,
      key: "resourceProviders",
    },
    {
      name: t("systemUsers.kpi.serviceProviders"),
      value: serviceProviders,
      key: "serviceProviders",
    },
    {
      name: t("systemUsers.kpi.engineers"),
      value: engineers,
      key: "engineers",
    },
  ];

  const total = investors + resourceProviders + serviceProviders + engineers;

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("adminStatistics.charts.userRoles.title")}
        </CardTitle>
        <CardDescription>
          {t("adminStatistics.charts.userRoles.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={ROLE_COLORS[entry.key]}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">
              {t("adminStatistics.kpi.totalUsers")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRolesPieChart;
