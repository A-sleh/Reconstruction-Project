import { useState } from "react";
import { useTranslation } from "react-i18next";

import { successToast } from "@/components/common/Toast";
import type {
  EngineerCertification,
  EngineerExperience,
  EngineerProject,
} from "@/features/engineer/profile/api/types";
import ExperienceList from "@/features/engineer/profile/components/ExperienceList";
import LastProjectList from "@/features/engineer/profile/components/LastProjectList";
import PortfolioList from "@/features/engineer/profile/components/PortfolioList";
import PortfolioStats from "@/features/engineer/profile/components/PortfolioStats";
import ProfileHeader from "@/features/engineer/profile/components/ProfileHeader";
import SkillsSection from "@/features/engineer/profile/components/SkillsSection";
import { MOCK_EXPERIENCE } from "@/features/engineer/profile/mock/experience";
import { MOCK_ENGINEER_PROFILE } from "@/features/engineer/profile/mock/profile";
import { MOCK_ENGINEER_PROJECTS } from "@/features/engineer/profile/mock/projects";
import { MOCK_PORTFOLIO_SKILLS } from "@/features/engineer/profile/mock/skills";

const EngineerProfile = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<EngineerProject[]>(
    MOCK_ENGINEER_PROJECTS,
  );
  const [experiences, setExperiences] = useState<EngineerExperience[]>(
    MOCK_EXPERIENCE,
  );
  const [skills, setSkills] = useState<string[]>(MOCK_PORTFOLIO_SKILLS.skills);
  const [certifications, setCertifications] = useState<
    EngineerCertification[]
  >(MOCK_PORTFOLIO_SKILLS.certifications);

  const handleAddProject = (project: EngineerProject) => {
    setProjects((prev) => [project, ...prev]);
    successToast(t("engineerProfile.projects.toast.created"));
  };

  const handleAddExperience = (experience: EngineerExperience) => {
    setExperiences((prev) => [experience, ...prev]);
    successToast(t("engineerProfile.experience.toast.created"));
  };

  const handleAddSkill = (skill: string) => {
    setSkills((prev) => (prev.includes(skill) ? prev : [...prev, skill]));
    successToast(t("engineerProfile.skills.toast.skillAdded"));
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
    successToast(t("engineerProfile.skills.toast.skillRemoved"));
  };

  const handleAddCertification = (cert: EngineerCertification) => {
    setCertifications((prev) => [cert, ...prev]);
    successToast(t("engineerProfile.skills.certification.toast.created"));
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== certId));
    successToast(t("engineerProfile.skills.certification.toast.deleted"));
  };

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED",
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <PortfolioStats
        totalProjects={projects.length}
        completed={completedProjects}
        inProgress={inProgressProjects}
        yearsExperience={MOCK_ENGINEER_PROFILE.professionalInfo.yearsOfExperience}
      />
      <LastProjectList projects={projects} onAddProject={handleAddProject} />
      <ExperienceList
        experiences={experiences}
        onAddExperience={handleAddExperience}
      />
      <SkillsSection
        skills={skills}
        certifications={certifications}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onAddCertification={handleAddCertification}
        onRemoveCertification={handleRemoveCertification}
      />
      <PortfolioList projects={projects} />
    </div>
  );
};

export default EngineerProfile;