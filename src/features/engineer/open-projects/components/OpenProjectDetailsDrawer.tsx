import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Lock, Eye } from "lucide-react";
import SensitiveLockedRow from "./SensitiveLockedRow";
import type { OpenProject } from "../api/types";
import { SCALE_META, daysUntil } from "../constants";

interface Props {
  project: OpenProject | null;
  applied: boolean;
  onClose: () => void;
  onApply: (project: OpenProject) => void;
}

export default function OpenProjectDetailsDrawer({
  project,
  applied,
  onClose,
  onApply,
}: Props) {
  const { t } = useTranslation();
  const isOpen = project !== null;

  if (!project) return null;

  const scale = SCALE_META[project.scale];
  const remaining = daysUntil(project.applicationDeadline);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-left text-lg leading-tight">
                {project.title}
              </SheetTitle>
              <SheetDescription className="mt-1 text-xs">
                {project.region}
              </SheetDescription>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${scale.color}`}
            >
              {t(scale.tKey)}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 pt-5 space-y-6">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="h-44 w-full rounded-lg object-cover"
          />

          <div className="flex flex-wrap gap-1.5">
            {project.requiredSpecialties.map((s) => (
              <Badge key={s} variant="secondary" className="text-[11px]">
                {t(`openProjects.disciplines.${s}Short`)}
              </Badge>
            ))}
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              {t("openProjects.details.overview")}
            </h4>
            <p className="text-sm leading-6 text-muted-foreground">
              {project.overview}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              {t("openProjects.details.deliverables")}
            </h4>
            <ul className="space-y-1.5">
              {project.highLevelDeliverables.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              {t("openProjects.details.skills")}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.requiredSkills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <SensitiveLockedRow
              label={t("openProjects.details.clientIdentity")}
              hint={t("openProjects.details.clientLockedHint")}
              icon={<Lock className="h-4 w-4 text-muted-foreground/60" />}
            />
            <SensitiveLockedRow
              label={t("openProjects.details.budget")}
              hint={t("openProjects.details.budgetLockedHint")}
              icon={<Lock className="h-4 w-4 text-muted-foreground/60" />}
            />
            <SensitiveLockedRow
              label={t("openProjects.details.blueprints")}
              hint={t("openProjects.details.blueprintsLockedHint")}
              icon={<Eye className="h-4 w-4 text-muted-foreground/60" />}
            />
          </div>
        </div>

        <div className="border-t border-gray-300 px-4 py-3">
          <Button
            className="w-full"
            onClick={() => onApply(project)}
            disabled={applied || remaining < 0}
          >
            {applied
              ? t("openProjects.details.applicationSent")
              : t("openProjects.details.apply")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
