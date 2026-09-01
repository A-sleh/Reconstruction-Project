import { useTranslation } from "react-i18next";
import { Award, Trash2, X, Plus } from "lucide-react";
import type { EngineerCertification } from "../api/types";
import AddSkillModal from "./AddSkillModal";
import AddCertificationModal from "./AddCertificationModal";

interface Props {
  skills: string[];
  certifications: EngineerCertification[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onAddCertification: (cert: EngineerCertification) => void;
  onRemoveCertification: (certId: string) => void;
}

const SkillsSection = ({
  skills,
  certifications,
  onAddSkill,
  onRemoveSkill,
  onAddCertification,
  onRemoveCertification,
}: Props) => {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t("engineerProfile.skills.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("engineerProfile.skills.subtitle")}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">
          {t("engineerProfile.skills.skillsLabel")}
        </p>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  aria-label={t("engineerProfile.skills.removeSkill", {
                    defaultValue: "Remove skill",
                  })}
                  className="text-primary/60 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <AddSkillModal
              onAdd={onAddSkill}
              openButton={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer">
                  <Plus className="h-3 w-3" />
                  {t("engineerProfile.skills.addSkill")}
                </span>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("engineerProfile.skills.emptySkills")}
            </p>
            <AddSkillModal onAdd={onAddSkill} />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">
          {t("engineerProfile.skills.certificationsLabel")}
        </p>
        {certifications.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="rounded-lg border border-gray-300 bg-white p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCertification(cert.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={t("engineerProfile.skills.removeCertification", {
                      defaultValue: "Remove certification",
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h4 className="font-semibold text-sm text-foreground">
                  {cert.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
            ))}
            <AddCertificationModal onAdd={onAddCertification} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("engineerProfile.skills.emptySkills")}
            </p>
            <AddCertificationModal onAdd={onAddCertification} />
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
