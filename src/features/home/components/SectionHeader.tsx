import { ScrollFadeIn } from "@/components/animations";
import Button from "@/components/inputs/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface ISectionHeader {
  link: string;
  title: string;
}

const SectionHeader: React.FC<ISectionHeader> = ({ title, link }) => {
  const { t } = useTranslation();
  return (
    <ScrollFadeIn className="flex justify-between items-center px-3 py-2 my-10 ">
      <h2 className="text-sm md:text-2xl text-primary font-bold flex-6 ">{title}</h2>
      <Button variant="outline" className="shrink flex-1 rounded-sm">
        <Link to={link}>
          {t("home.seeMore")}
        </Link>
      </Button>
    </ScrollFadeIn>
  );
};

export default SectionHeader;
