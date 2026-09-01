import { useTranslation } from "react-i18next";
import { BriefcaseBusiness } from "lucide-react";
import type { EngineerExperience } from "../api/types";
import ExperienceCard from "./ExperienceCard";
import ExperienceModal from "./ExperienceModal";

interface Props {
  experiences: EngineerExperience[];
  onAddExperience: (experience: EngineerExperience) => void;
}

const ExperienceList = ({ experiences, onAddExperience }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("engineerProfile.experience.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.experience.subtitle")}
          </p>
        </div>
        <ExperienceModal onAdd={onAddExperience} />
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-3">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-white shadow-card p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted text-muted-foreground grid place-items-center">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            {t("engineerProfile.experience.empty")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.experience.emptyHint")}
          </p>
        </div>
      )}
    </section>
  );
};

export default ExperienceList;