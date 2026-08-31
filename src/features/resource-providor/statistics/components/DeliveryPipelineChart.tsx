import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { RequestStat } from "../api";

interface DeliveryPipelineChartProps {
  requests: RequestStat[];
}

const DeliveryPipelineChart = ({ requests }: DeliveryPipelineChartProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const stats = (() => {
    let totalResources = 0;
    let totalDelivered = 0;
    let fullyDelivered = 0;
    let partiallyDelivered = 0;
    let pending = 0;

    requests.forEach((r) => {
      const reqTotal = r.resources.reduce((s, res) => s + res.quantity, 0);
      const reqDelivered = r.resources.reduce((s, res) => s + res.delivered, 0);
      totalResources += reqTotal;
      totalDelivered += reqDelivered;

      if (r.status === "completed") fullyDelivered += 1;
      else if (r.status === "partial") partiallyDelivered += 1;
      else if (r.status === "pending") pending += 1;
    });

    const completionRate =
      totalResources > 0
        ? Math.round((totalDelivered / totalResources) * 100)
        : 0;

    return {
      fullyDelivered,
      partiallyDelivered,
      pending,
      total: requests.length,
      completionRate,
      totalResources,
      totalDelivered,
    };
  })();

  const pipelineData = [
    {
      label: t(
        "resourceProvidor.statistics.charts.deliveryPipeline.pending",
      ),
      count: stats.pending,
      pct: stats.total
        ? Math.round((stats.pending / stats.total) * 100)
        : 0,
    },
    {
      label: t(
        "resourceProvidor.statistics.charts.deliveryPipeline.partial",
      ),
      count: stats.partiallyDelivered,
      pct: stats.total
        ? Math.round((stats.partiallyDelivered / stats.total) * 100)
        : 0,
    },
    {
      label: t(
        "resourceProvidor.statistics.charts.deliveryPipeline.completed",
      ),
      count: stats.fullyDelivered,
      pct: stats.total
        ? Math.round((stats.fullyDelivered / stats.total) * 100)
        : 0,
    },
  ];

  const stageColors = ["bg-muted-foreground", "bg-amber-500", "bg-emerald-500"];

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("resourceProvidor.statistics.charts.deliveryPipeline.title")}
        </CardTitle>
        <CardDescription>
          {t("resourceProvidor.statistics.charts.deliveryPipeline.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("resourceProvidor.statistics.charts.deliveryPipeline.completionRate")}
          </span>
          <span className="font-bold text-lg text-foreground">
            {stats.completionRate}%
          </span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {pipelineData.map((stage, i) => (
            <div key={stage.label} className="text-center">
              <div
                className={`h-2 rounded-full ${stageColors[i]} mb-2`}
                style={{ width: `${Math.max(stage.pct, 8)}%`, margin: "0 auto" }}
              />
              <p className="text-xl font-bold">{stage.count}</p>
              <p className="text-xs text-muted-foreground">{stage.label}</p>
              <p className="text-xs text-muted-foreground">{stage.pct}%</p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-200 flex justify-between text-xs text-muted-foreground">
          <span>
            {t("resourceProvidor.statistics.charts.deliveryPipeline.delivered")}{" "}
            {stats.totalDelivered}/{stats.totalResources}
          </span>
          <span>
            {t("resourceProvidor.statistics.charts.deliveryPipeline.requests")}{" "}
            {stats.total}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryPipelineChart;
