import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  DollarSign,
  Package,
  Percent,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ProviderDashboardData } from "../api/types";

interface Props {
  data: ProviderDashboardData;
}

const iconPool: LucideIcon[] = [
  DollarSign,
  Package,
  TrendingUp,
  Percent,
  CalendarDays,
  ShieldCheck,
];

const DashboardInsights = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("project.dashboard.insights.title")}
        </CardTitle>
        <CardDescription>
          {t("project.dashboard.insights.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.insights.map((item, index) => {
            const Icon = iconPool[index % iconPool.length];
            return (
              <div
                key={item.labelKey}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-muted/30"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
                    item.accent,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">
                    {t(item.labelKey)}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardInsights;
