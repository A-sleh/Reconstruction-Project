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
import type { WorkSite } from "@/features/work-sites/api/types";

const TYPE_COLORS = [
  "hsl(210 80% 50%)",
  "hsl(142 71% 45%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 58%)",
  "hsl(0 84% 60%)",
  "hsl(199 89% 48%)",
  "hsl(330 81% 60%)",
  "hsl(160 60% 45%)",
];

interface SitesByTypePieProps {
  sites: WorkSite[];
}

const SitesByTypePie = ({ sites }: SitesByTypePieProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const data = (() => {
    const map = new Map<string, number>();
    sites.forEach((s) => {
      const type = s.workSiteType || "Unknown";
      map.set(type, (map.get(type) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  })();

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.sitesByType.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.sitesByType.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
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
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={TYPE_COLORS[i % TYPE_COLORS.length]}
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
      </CardContent>
    </Card>
  );
};

export default SitesByTypePie;
