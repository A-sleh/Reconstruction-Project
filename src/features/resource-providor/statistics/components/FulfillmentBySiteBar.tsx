import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { SiteStat } from "../api";

interface FulfillmentBySiteBarProps {
  sites: SiteStat[];
}

const FulfillmentBySiteBar = ({ sites }: FulfillmentBySiteBarProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const sorted = [...sites]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 8);

  const getColor = (pct: number) => {
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.fulfillmentBySite.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.fulfillmentBySite.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((s) => (
          <div key={s.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium">
                {s.name.length > 18 ? s.name.slice(0, 16) + "…" : s.name}
              </span>
              <span className="text-muted-foreground">{s.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getColor(s.progress)}`}
                style={{ width: `${s.progress}%` }}
              />
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("resourceProvidor.statistics.charts.fulfillmentBySite.noData")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FulfillmentBySiteBar;
