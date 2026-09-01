import { CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/common/EmptyState";
import type { EngineerStatistics } from "../api/types";

interface UpcomingDeadlinesProps {
  stats: EngineerStatistics;
}

const UpcomingDeadlines = ({ stats }: UpcomingDeadlinesProps) => {
  const { t } = useTranslation();
  const deadlines = stats.upcomingDeadlines;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("engineerStatistics.deadlines.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("engineerStatistics.deadlines.subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <EmptyState message={t("engineerStatistics.deadlines.title")} />
        ) : (
          <div className="space-y-4">
            {deadlines.map((item) => {
              const isUrgent = item.daysLeft <= 30;
              const isWarning = item.daysLeft <= 60;

              return (
                <div
                  key={item.projectId}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.client} · {item.location}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      isUrgent
                        ? "bg-destructive/10 text-destructive"
                        : isWarning
                          ? "bg-gold/10 text-gold"
                          : "bg-emerald/10 text-emerald"
                    }
                  >
                    {isUrgent
                      ? t("engineerStatistics.deadlines.urgent")
                      : t("engineerStatistics.deadlines.daysLeft", {
                          count: item.daysLeft,
                        })}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
