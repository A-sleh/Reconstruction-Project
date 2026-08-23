import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDeleteProject } from "../api/actions";
import type { ProjectListItem } from "../api/types";
import { NewProjectModel } from "./NewProjectModel";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { getProjectStatusStyle } from "./ProjectStatusStyle";

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const SummeryProjectCard = ({ project }: { project: ProjectListItem }) => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isArabic = i18n.language === "ar";
  const locale = isArabic ? "ar-SY" : "en-US";

  const statusAccent = getProjectStatusStyle(project.status).accent;

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(locale);
  };

  return (
    <motion.div
      className="h-full"
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group h-full rounded-2xl ">
        <Card className="relative h-full overflow-hidden rounded-xl border-gray-300 bg-white transition-smooth hover:border-primary/30">
          <span
            aria-hidden
            className={cn(
              "absolute top-0 left-0 w-full h-1.5 rounded-e-full",
              statusAccent,
            )}
          />

          <CardContent className="flex h-full flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3 ps-1">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-foreground transition-smooth group-hover:text-primary">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    #{project.id}
                  </p>
                </div>
              </div>

              <ProjectStatusBadge status={project.status} />
            </div>

            <div className="h-px bg-border" />

            <div className="grid gap-3 ps-1">
              <DetailRow
                icon={Building2}
                label={t("project.list.building")}
                value={`#${project.buildingId}`}
              />
              <DetailRow
                icon={User}
                label={t("project.list.investor")}
                value={`#${project.investorId}`}
              />
              <DetailRow
                icon={CalendarDays}
                label={t("project.list.schedule")}
                value={`${formatDate(project.date)} – ${formatDate(project.endDate)}`}
              />
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-300 pt-4">
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-full pe-1.5 ps-4 font-medium text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link
                  to={paths.app.projects.projectDetails.getHref(project.id)}
                >
                  {t("project.list.viewDetails")}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-primary group-hover:text-white"
                  >
                    <ArrowRight
                      className={cn("h-3.5 w-3.5", isArabic && "-scale-x-100")}
                    />
                  </span>
                </Link>
              </Button>

              <div className="flex items-center gap-1">
                <NewProjectModel
                  openButton={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:bg-primary/10 hover:text-primary"
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

                <ConfirmDelete
                  openKey={`delete-project-${project.id}`}
                  keys={{
                    title: "project.deleteConfirm.title",
                    descriptionPrefix:
                      "project.deleteConfirm.descriptionPrefix",
                    confirm: "project.deleteConfirm.confirm",
                    cancel: "project.deleteConfirm.cancel",
                  }}
                  item={project.name}
                  isLoading={isDeleting}
                  onConfirm={() => deleteProject({ id: project.id })}
                  openButton={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={t("project.deleteConfirm.title")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SummeryProjectCard;
