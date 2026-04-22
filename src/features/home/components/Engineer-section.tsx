import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import { assets } from "@/assets/assets";
import Persone, { IInvestor } from "./Person-card";

const investores: IInvestor[] = [
  {
    name: "عبدالفتاح",
    role: "مهندس مدني",
    avatar: assets.landingPageImage_structuralEngineer,
    description: "افضل مهندس ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    role: "مهندس مدني",
    avatar: assets.homePage_hero_engineer,
    description: "افضل مهندس ضمن المنصة",
  },

  {
    name: "عبدالفتاح",
    role: "مهندس مدني",
    avatar: assets.landingPageImage_projectManagment,
    description: "افضل مهندس ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    role: "مهندس مدني",
    avatar: assets.homePage_hero_service,
    description: "افضل مهندس ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    role: "مهندس مدني",
    avatar: assets.landingPageImage_jop_resource,
    description: "افضل مهندس ضمن المنصة",
  },
];

const EngineerSection = () => {
  const { t } = useTranslation();
  return (
    <div>
      <SectionHeader
        link={window.location.pathname}
        title={t("home.engineers")}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {investores.map((investor, Idx) => {
          return <Persone {...investor} key={Idx} />;
        })}
      </div>
    </div>
  );
};

export default EngineerSection;
