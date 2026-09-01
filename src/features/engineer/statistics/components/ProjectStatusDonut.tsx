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
import type { EngineerStatistics } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "hsl(160 84% 39%)",
  IN_PROGRESS: "hsl(38 92% 50%)",
  PLANNING: "hsl(215 25% 27%)",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "engineerStatistics.kpi.completed",
  IN_PROGRESS: "engineerStatistics.kpi.inProgress",
  PLANNING: "engineerStatistics.kpi.planning",
};

interface ProjectStatusDonutProps {
  stats: EngineerStatistics;
}

const ProjectStatusDonut = ({ stats }: ProjectStatusDonutProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const data = stats.projectsByStatus.map((item) => ({
    name: t(STATUS_LABELS[item.status] ?? item.status),
    value: item.count,
    key: item.status,
  }));

  return (
    <Card dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("engineerStatistics.charts.status.title")}
        </CardTitle>
        <CardDescription>
          {t("engineerStatistics.charts.status.description")}
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
                  fill={STATUS_COLORS[entry.key]}
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
            <p className="text-2xl font-bold">{stats.kpi.totalProjects}</p>
            <p className="text-xs text-muted-foreground">
              {t("engineerStatistics.charts.status.centerLabel")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusDonut;
