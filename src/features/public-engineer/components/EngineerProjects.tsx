import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import LastProjectCard from "@/features/engineer/profile/components/LastProjectCard";
import type { PublicEngineerProfile } from "@/features/engineer/profile/api/types";

export default function EngineerProjects({
  engineer,
}: {
  engineer: PublicEngineerProfile;
}) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      {engineer.currentProject && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t("publicEngineer.projects.currentTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {engineer.currentProject.title}
            </p>
          </div>
          <LastProjectCard project={engineer.currentProject} />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("publicEngineer.projects.recentTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("publicEngineer.projects.recentSubtitle")}
          </p>
        </div>

        {engineer.recentProjects.length === 0 ? (
          <div className="rounded-lg border border-gray-300 bg-white shadow-card p-10 text-center">
            <FolderOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("publicEngineer.projects.empty")}
            </h3>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {engineer.recentProjects.map((project) => (
              <LastProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
