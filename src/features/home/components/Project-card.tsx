import Button from "@/components/inputs/Button";
import { useTranslation } from "react-i18next";

export interface IProjectCard {
  picture: string;
  owner: {
    name: string;
    role: string;
  };
  totalEngineers: number;
  projectDate: Date;
  projectBudget: number;
}

const ProjectCard: React.FC<IProjectCard> = ({
  owner,
  picture,
  totalEngineers,
  projectBudget,
  projectDate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative  gap-2 bg-gray-300 p-2 rounded-md w-full group">
      <div className="relative gap-2 my-1 overflow-hidden">
        <div className="space-y-2 flex gap-2 my-2">
          <div className="w-full  p-2 bg-white rounded-md h-full">
            <h6 className="text-sm">{t("home.totalEngineersTitle")}</h6>
            <span className="font-bold font-2xl">{totalEngineers}</span>
          </div>
          <div className="w-full p-2 bg-white rounded-md" h-full>
            <h6 className="text-sm">{t("home.projectBudgetTitle")}</h6>
            <span className="font-bold font-2xl">{projectBudget}</span>
          </div>
          <div className="w-full p-2 bg-white rounded-md h-full ">
            <h6 className="text-sm">{t("home.projectDate")}</h6>
            <span className="font-bold font-2xl">
              {projectDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <img
          src={picture}
          alt={`landing-${picture}`}
          className="rounded-md w-200 h-70 flex-1 group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 top-20 z-2 bg-linear-to-b from-white to-40% to-transparent w-[30%] blur-sm"></div>

        <div className={`flex gap-2 items-start z-20 absolute right-6 top-24 `}>
          <div>
            <span className="text-gray-700 text-[12px]">{owner.role}</span>
            <h6 className="text-[13px]">{owner.name}</h6>
          </div>
        </div>
      </div>
      <Button className="rounded-md">{t("home.seeDetails")}</Button>
    </div>
  );
};

export default ProjectCard;
