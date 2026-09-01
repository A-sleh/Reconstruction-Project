import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { actionIcons } from "./actionMeta";

export interface ActionCountEntry {
  name: string;
  action: string;
  count: number;
}

interface Props {
  data: ActionCountEntry[];
  isArabic: boolean;
}

const ActionsByTypeChart = ({ data, isArabic }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t(
            "projectsEngineers.dashboard.charts.byType",
            "Actions by Type",
          )}
        </CardTitle>
        <CardDescription>
          {t(
            "projectsEngineers.dashboard.charts.byTypeDesc",
            "Distribution of engineer activities in the project.",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.action}
                  fill={
                    actionIcons[entry.action as keyof typeof actionIcons]
                      ?.color ?? "hsl(var(--muted))"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
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

export default ActionsByTypeChart;