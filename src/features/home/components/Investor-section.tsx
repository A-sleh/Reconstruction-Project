import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import { assets } from "@/assets/assets";
import InvestorCard, { IInvestor } from "./Investor-card";

const investores: IInvestor[] = [
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
    description: "افضل مستثمر ضمن المنصة",
  },
  {
    name: "عبدالفتاح",
    avatar: assets.landingPageImage_structuralEngineer,
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {investores.map((investor,Idx) => {
            return <InvestorCard {...investor} key={Idx} />
        })}
      </div>
    </section>
  );
};

export default InvestorSection;
