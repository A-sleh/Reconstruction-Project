import Loader from "@/components/shared/Loader";
import { useProjectById } from "@/features/project/api/queries";
import ProjectDetailsHeader from "@/features/project/components/ProjectDetailsHeader";
import ProjectSettingsSection from "@/features/project/components/ProjectSettingsSection";
import ProjectSideBar from "@/features/project/components/ProjectSideBar";
import { OverviewSection } from "@/features/project/components/ProjectSummeryCard";
import AllProvidorItems from "@/features/work-site-items/components/AllProvidorItems";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Project = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const numericId = Number(projectId);

  const { data: project, isLoading, error } = useProjectById(numericId);
  const [activeKey, setActiveKey] = useState("overview");

  if (!Number.isFinite(numericId)) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p className="text-sm text-muted-foreground">
          {t("project.details.error")}
        </p>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (error || !project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p className="text-sm text-muted-foreground">
          {t("project.details.error")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectDetailsHeader projectId={numericId} />

      <div className="flex items-start gap-4">
        <ProjectSideBar activeKey={activeKey} onChange={setActiveKey} />

        <section className="min-w-0 flex-1 space-y-4">
          {activeKey === "overview" && <OverviewSection project={project} />}
          {activeKey === "manage resources" && <AllProvidorItems />}
          {activeKey === "settings" && (
            <ProjectSettingsSection project={project} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Project;
