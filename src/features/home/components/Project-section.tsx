import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import ProjectCard, { IProjectCard } from "./Project-card";
import { assets } from "@/assets/assets";

const projects: IProjectCard[] = [
  {
    owner: {
      name: "عبدالفتاح عصلة",
      role: "مستثمر",
    },
    picture: assets.landingPageImage_modernBuilding,
    projectBudget: 2000,
    totalEngineers: 12,
    projectDate: new Date(),
  },
  {
    owner: {
      name: "عبدالفتاح عصلة",
      role: "مستثمر",
    },
    picture: assets.homePage_hero_building,
    projectBudget: 2000,
    totalEngineers: 12,
    projectDate: new Date(),
  },
  {
    owner: {
      name: "عبدالفتاح عصلة",
      role: "مستثمر",
    },
    picture: assets.landingPageImage_structuralEngineer,
    projectBudget: 2000,
    totalEngineers: 12,
    projectDate: new Date(),
  },
];

const ProjectSection = () => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeader
        link={window.location.pathname}
        title={t("home.opnedProjectTitle")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project, Idx) => {
          return <ProjectCard {...project} key={Idx} />;
        })}
      </div>
    </div>
  );
};

export default ProjectSection;
