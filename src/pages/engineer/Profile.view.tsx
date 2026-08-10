import { successToast } from "@/components/common/Toast";
import type { EngineerProject } from "@/features/engineer/profile/api/types";
import LastProjectList from "@/features/engineer/profile/components/LastProjectList";
import PortfolioList from "@/features/engineer/profile/components/PortfolioList";
import ProfileHeader from "@/features/engineer/profile/components/ProfileHeader";
import { MOCK_ENGINEER_PROJECTS } from "@/features/engineer/profile/mock/projects";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const EngineerProfile = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<EngineerProject[]>(
    MOCK_ENGINEER_PROJECTS,
  );

  const handleAddProject = (project: EngineerProject) => {
    setProjects((prev) => [project, ...prev]);
    successToast(t("engineerProfile.projects.toast.created"));
  };

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <LastProjectList projects={projects} onAddProject={handleAddProject} />
      <PortfolioList projects={projects} />
    </div>
  );
};

export default EngineerProfile;
