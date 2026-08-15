import { useTranslation } from "react-i18next";
import {
  Building2,
  CalendarDays,
  Construction,
  PauseCircle,
  User,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectListItem, ProjectStatus } from "../api/types";

const statusStyles: Record<
  ProjectStatus,
  { className: string; icon: typeof Construction }
> = {
  Initializing: { className: "bg-primary/10 text-primary", icon: Construction },
  InProgress: { className: "bg-emerald-soft text-emerald", icon: Construction },
  Suspended: { className: "bg-warning/10 text-warning", icon: PauseCircle },
  Canceled: { className: "bg-destructive/10 text-destructive", icon: XCircle },
  Done: { className: "bg-success/10 text-success", icon: CheckCircle2 },
};

const fallbackStatusStyle = {
  className: "bg-muted text-muted-foreground",
  icon: Construction,
};

const SummeryProjectCard = ({ project }: { project: ProjectListItem }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const locale = isArabic ? "ar-SY" : "en-US";

  const statusStyle = statusStyles[project.status] ?? fallbackStatusStyle;
  const StatusIcon = statusStyle.icon;

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(locale);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground leading-snug">
              {project.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              #{project.id}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              statusStyle.className,
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {t(`project.status.${project.status}`)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {t("project.list.building")}{" "}
              <span className="font-medium">#{project.buildingId}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {t("project.list.investor")}{" "}
              <span className="font-medium">#{project.investorId}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {formatDate(project.date)}
              <span className="mx-1 text-muted-foreground">–</span>
              {formatDate(project.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummeryProjectCard;
