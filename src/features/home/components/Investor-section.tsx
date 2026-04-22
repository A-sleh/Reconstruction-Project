import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import { assets } from "@/assets/assets";
import Persone, { IInvestor } from "./Person-card";

const investores: IInvestor[] = [
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
    role: "مستثمر",
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    role: "مستثمر",
    avatar: assets.landingPageImage_jop_resource,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    role: "مستثمر",
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_projectManagment,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    role: "مستثمر",
    name: "عبدالفتاح",
    avatar: assets.homePage_hero_service,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    role: "مستثمر",
    avatar: assets.homePage_hero_engineer,
    description: "افضل مستثمر ضمن المنصة",
  },
];

const InvestorSection = () => {
  const { t } = useTranslation();
  return (
    <section>
      <SectionHeader
        link={window.location.pathname}
        title={t("home.websitInvestores")}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {investores.map((investor, Idx) => {
          if (Idx == 2 )
            return (
              <div className="lg:col-span-2">
                <Persone {...investor} key={Idx} />
              </div>
            );
          return <Persone {...investor} key={Idx} />;
        })}
      </div>
    </section>
  );
};

export default InvestorSection;
