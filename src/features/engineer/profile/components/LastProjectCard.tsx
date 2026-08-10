import { useTranslation } from "react-i18next";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Construction,
  MapPin,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  EngineerProject,
  EngineerProjectStatus,
} from "../api/types";

const statusStyles: Record<
  EngineerProjectStatus,
  { className: string; icon: typeof CheckCircle2 }
> = {
  COMPLETED: { className: "bg-success/10 text-success", icon: CheckCircle2 },
  IN_PROGRESS: { className: "bg-primary/10 text-primary", icon: Construction },
  PLANNING: { className: "bg-warning/10 text-warning", icon: CalendarCheck },
};

const fallbackStatusStyle = {
  className: "bg-muted text-muted-foreground",
  icon: Building2,
};

const LastProjectCard = ({ project }: { project: EngineerProject }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const locale = isArabic ? "ar-SY" : "en-US";

  const statusStyle = statusStyles[project.status] ?? fallbackStatusStyle;
  const StatusIcon = statusStyle.icon;

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(locale);
  };

  const formatBudget = (value: number) =>
    `${new Intl.NumberFormat(locale).format(value)} $`;

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-muted">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-gradient-primary text-white/90">
            <Building2 className="h-10 w-10" />
          </div>
        )}
        <span
          className={cn(
            "absolute top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-card backdrop-blur-sm",
            statusStyle.className,
            isArabic ? "right-3" : "left-3",
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {t(`engineerProfile.projects.status.${project.status}`, {
            defaultValue: project.status,
          })}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-foreground leading-snug">
            {project.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {project.category}
          </p>
        </div>

        {project.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        <div className="mt-auto space-y-2 pt-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {formatDate(project.startDate)}
              <span className="mx-1 text-muted-foreground">–</span>
              {formatDate(project.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium text-primary">
              {formatBudget(project.budget)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastProjectCard;
