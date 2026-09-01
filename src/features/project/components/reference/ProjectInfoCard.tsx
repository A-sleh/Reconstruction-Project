import {
  Building2,
  CalendarDays,
  ClipboardList,
  Hash,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectDetails } from "../../api/types";
import { ProjectStatusBadge } from "../ProjectStatusBadge";

const OverviewItem = ({
  icon: Icon,
  label,
  value,
  hint,
  accent = "bg-muted text-muted-foreground",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-muted/40 p-4 transition-smooth hover:border-primary/30">
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        accent,
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      {hint && (
        <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  </div>
);

const ProjectInfoCard = ({ project }: { project: ProjectDetails }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(isArabic ? "ar-SY" : "en-US");
  };

  return (
    <Card className="overflow-hidden shadow-card">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" />
          </span>
          {t("project.details.overview.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 p-4">
          <span className="text-sm text-muted-foreground">
            {t("project.details.overview.status")}
          </span>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <OverviewItem
            icon={ClipboardList}
            label={t("project.details.overview.name")}
            value={project.name}
            accent="bg-primary/10 text-primary"
          />
          <OverviewItem
            icon={Hash}
            label={t("project.details.overview.projectId")}
            value={`#${project.id}`}
          />
          <OverviewItem
            icon={User}
            label={t("project.details.overview.investor")}
            value={project.investor?.name ?? `#${project.id}`}
            hint={t("project.details.reference.investorHint")}
            accent="bg-warning/10 text-warning"
          />
          <OverviewItem
            icon={Building2}
            label={t("project.details.overview.building")}
            value={project.building?.name ?? `#${project.buildingId}`}
            accent="bg-emerald-soft text-emerald"
          />
          <OverviewItem
            icon={CalendarDays}
            label={t("project.details.overview.startDate")}
            value={formatDate(project.date)}
            accent="bg-success/10 text-success"
          />
          <OverviewItem
            icon={CalendarDays}
            label={t("project.details.overview.endDate")}
            value={formatDate(project.endDate)}
            accent="bg-destructive/10 text-destructive"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoCard;
