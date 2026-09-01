import { useTranslation } from "react-i18next";
import { Building2, CalendarDays, MapPin } from "lucide-react";
import i18n from "@/lib/i18n";
import type { EngineerExperience } from "../api/types";

interface Props {
  experience: EngineerExperience;
}

const ExperienceCard = ({ experience }: Props) => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const locale = isArabic ? "ar-SY" : "en-US";

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale);
  };

  return (
    <div
      className={`rounded-lg border border-gray-300 bg-white shadow-card p-4 border-s-4 ${
        experience.isCurrent ? "border-primary" : "border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{experience.jobTitle}</h3>
          {experience.isCurrent && (
            <span className="inline-block mt-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              {t("engineerProfile.experience.current")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>{experience.company}</span>
        {experience.location && (
          <>
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{experience.location}</span>
          </>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span>
          {formatDate(experience.startDate)}
          <span className="mx-1">–</span>
          {experience.isCurrent
            ? t("engineerProfile.experience.present")
            : experience.endDate
              ? formatDate(experience.endDate)
              : "—"}
        </span>
      </div>

      {experience.description && (
        <p className="mt-3 text-sm text-muted-foreground">
          {experience.description}
        </p>
      )}
    </div>
  );
};

export default ExperienceCard;
