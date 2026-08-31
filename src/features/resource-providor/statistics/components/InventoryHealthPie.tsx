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
import type { ResourceStat } from "../api";

const HEALTH_COLORS: Record<string, string> = {
  "in-stock": "hsl(142 71% 45%)",
  "low-stock": "hsl(38 92% 50%)",
  "out-of-stock": "hsl(0 84% 60%)",
};

interface InventoryHealthPieProps {
  resources: ResourceStat[];
}

const InventoryHealthPie = ({ resources }: InventoryHealthPieProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const data = (["in-stock", "low-stock", "out-of-stock"] as const).map(
    (status) => ({
      name: t(
        `resourceProvidor.statistics.charts.inventoryHealth.statuses.${status}`,
        { defaultValue: status },
      ),
      value: resources.filter((r) => r.availability === status).length,
      color: status,
    }),
  );

  const total = resources.length;

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.inventoryHealth.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.inventoryHealth.description")}
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
                  key={entry.color}
                  fill={HEALTH_COLORS[entry.color]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid gray",
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">
              {t("resourceProvidor.statistics.charts.inventoryHealth.total")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryHealthPie;
