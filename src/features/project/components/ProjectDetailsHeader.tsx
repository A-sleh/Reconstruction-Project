import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paths } from "@/config/paths";
import { useProjectById } from "../api/queries";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

interface ProjectDetailsHeaderProps {
  projectId: number;
}

const ProjectDetailsHeader = ({ projectId }: ProjectDetailsHeaderProps) => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";

  const { data: project } = useProjectById(projectId);

  const initial = project?.name.trim().charAt(0);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="rounded-2xl bg-muted p-1.5">
        <div className="flex w-full flex-wrap items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-4 shadow-card sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(paths.app.projects.getHref())}
            aria-label={t("project.details.back")}
            className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className={cn("h-4 w-4", isArabic && "rotate-180")} />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
              {initial ? (
                initial
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-foreground">
                {project?.name ?? "—"}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                #{projectId}
              </p>
            </div>
          </div>

          {project && <ProjectStatusBadge status={project.status} />}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailsHeader;
