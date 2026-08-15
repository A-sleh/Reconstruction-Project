import { useTranslation } from "react-i18next";
import {
  Building2,
  CalendarDays,
  Construction,
  PauseCircle,
  Trash2,
  User,
  XCircle,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Model from "@/components/model/Model";
import { useDeleteProject } from "../api/actions";
import type { ProjectListItem, ProjectStatus } from "../api/types";
import { NewProjectModel } from "./NewProjectModel";
import { motion } from "framer-motion";

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

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

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
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                statusStyle.className,
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {t(`project.status.${project.status}`)}
            </span>

            <NewProjectModel
              openButton={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  aria-label={t("project.updateProject.title")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
              initial={{
                id: project.id,
                name: project.name,
                date: project.date,
                endDate: project.endDate,
                status: project.status,
              }}
            />

            <Model>
              <Model.Open opens={`delete-project-${project.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  aria-label={t("project.deleteConfirm.title")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Model.Open>
              <Model.Window name={`delete-project-${project.id}`} model_width="max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="p-2 rounded-2xl bg-white"
                >
                  <div className="mb-4 flex items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-foreground">
                        {t("project.deleteConfirm.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {t("project.deleteConfirm.descriptionPrefix")}
                        <span className="font-semibold text-foreground">
                          {" "}
                          {project.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      disabled={isDeleting}
                      onClick={() => deleteProject({ id: project.id })}
                      type="button"
                      variant="destructive"
                      className="flex items-center gap-2 text-sm px-4 py-2 shadow-sm bg-red-500 text-white hover:opacity-75 transition-all cursor-pointer"
                    >
                      {isDeleting ? (
                        t("common.loading", "Deleting...")
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 opacity-90" />
                          {t("project.deleteConfirm.confirm")}
                        </>
                      )}
                    </Button>
                    <Model.Close>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-sm px-4 py-2 border border-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        {t("project.deleteConfirm.cancel")}
                      </Button>
                    </Model.Close>
                  </div>
                </motion.div>
              </Model.Window>
            </Model>
          </div>
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
