import { MapPin, Clock, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import type { OpenProject } from "../api/types";
import {
  SCALE_META,
  CLOSING_SOON_WINDOW_DAYS,
  daysUntil,
  daysSince,
  durationLabel,
} from "../constants";

interface Props {
  project: OpenProject;
  onOpen: () => void;
  applied?: boolean;
}

export default function OpenProjectCard({
  project,
  onOpen,
  applied = false,
}: Props) {
  const { t } = useTranslation();
  const scale = SCALE_META[project.scale];
  const remaining = daysUntil(project.applicationDeadline);
  const isClosingSoon = remaining >= 0 && remaining <= CLOSING_SOON_WINDOW_DAYS;
  const isExpired = remaining < 0;
  const postedAgo = daysSince(project.postedAt);

  return (
    <div className="group flex h-full flex-col rounded-xl border border-gray-300 bg-white shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${scale.color}`}
          >
            {t(scale.tKey)}
          </span>
          {isClosingSoon && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {t("openProjects.card.closingSoon")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold text-foreground leading-snug">
          {project.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{project.region}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.requiredSpecialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-[11px]">
              {t(`openProjects.disciplines.${s}Short`)}
            </Badge>
          ))}
        </div>

        <p className="mt-3 line-clamp-2 min-h-0 flex-1 text-sm leading-5 text-muted-foreground">
          {project.overview}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {durationLabel(project.durationWeeks)}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {isExpired
              ? t("openProjects.card.deadline")
              : t("openProjects.card.daysLeft", { days: remaining })}
          </span>
          <span className="ml-auto text-muted-foreground/60">
            {postedAgo === 0
              ? "اليوم"
              : postedAgo === 1
                ? "أمس"
                : `منذ ${postedAgo} أيام`}
          </span>
        </div>

        <div className="mt-3 pt-1">
          <Button
            variant={applied ? "outline" : "default"}
            className="w-full"
            onClick={onOpen}
            disabled={applied || isExpired}
          >
            {applied
              ? t("openProjects.details.applicationSent")
              : t("openProjects.card.viewDetails")}
          </Button>
        </div>
      </div>
    </div>
  );
}
