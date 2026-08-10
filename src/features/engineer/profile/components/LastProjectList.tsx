import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import type { EngineerProject } from "../api/types";
import LastProjectCard from "./LastProjectCard";
import NewProjectModel from "./ProjectModel";

interface Props {
  projects: EngineerProject[];
  onAddProject: (project: EngineerProject) => void;
}

const LastProjectList = ({ projects, onAddProject }: Props) => {
  const { t } = useTranslation();
  const lastProjects = projects.slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("engineerProfile.projects.lastProjects.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.projects.lastProjects.subtitle")}
          </p>
        </div>
        <NewProjectModel onAdd={onAddProject} />
      </div>

      {lastProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lastProjects.map((project) => (
            <LastProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-white shadow-card p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted text-muted-foreground grid place-items-center">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            {t("engineerProfile.projects.lastProjects.empty")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.projects.lastProjects.emptyHint")}
          </p>
        </div>
      )}
    </section>
  );
};

export default LastProjectList;
