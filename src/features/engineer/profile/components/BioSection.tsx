import {
  Award,
  BadgeCheck,
  FileBadge,
  FolderOpen,
  HardHat,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";

import type { EngineerProfile } from "../api/engineer-profile";

interface Props {
  profile: EngineerProfile;
}

const BioSection = ({ profile }: Props) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const years = profile.professionalInfo.yearsOfExperiece;

  const stats = [
    {
      label: t("engineerProfile.stats.yearsExperience"),
      value: String(years),
      suffix: t("engineerProfile.stats.yearsExperienceUnit", {
        defaultValue: "",
      }),
      icon: Award,
      accent: "bg-emerald-soft text-emerald",
    },
    {
      label: t("engineerProfile.stats.contributedProjects"),
      value: String(profile.numberOfProjectsContributed),
      suffix: "",
      icon: Layers,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: t("engineerProfile.stats.portfolios"),
      value: String(profile.portfolios.length),
      suffix: "",
      icon: FolderOpen,
      accent: "bg-gold/10 text-gold",
    },
    {
      label: t("engineerProfile.verificationStatusLabel", {
        defaultValue: "Verification",
      }),
      value:
        profile.verificationStatus === "VERIFIED"
          ? t("engineerProfile.verificationStatus.VERIFIED")
          : profile.verificationStatus === "PENDING"
            ? t("engineerProfile.verificationStatus.PENDING")
            : t("engineerProfile.verificationStatus.REJECTED"),
      suffix: "",
      icon:
        profile.verificationStatus === "VERIFIED" ? ShieldCheck : BadgeCheck,
      accent: "bg-success/10 text-success",
    },
  ];

  const professionalRows = [
    {
      label: t("engineerProfile.specialityTitle"),
      value: t(`engineerProfile.speciality.${profile.speciality}`, {
        defaultValue: profile.speciality,
      }),
      icon: HardHat,
    },
    {
      label: t("engineerProfile.professionalInfo.specialization"),
      value: t(
        `engineerProfile.specialization.${profile.professionalInfo.specialization}`,
        { defaultValue: profile.professionalInfo.specialization },
      ),
      icon: BadgeCheck,
    },
    {
      label: t("engineerProfile.professionalInfo.licenseNumber"),
      value: profile.professionalInfo.licenseNumber,
      icon: FileBadge,
    },
    {
      label: t("engineerProfile.contact.syndicateId"),
      value: `#${profile.syndicateId}`,
      icon: ShieldCheck,
    },
    {
      label: t("engineerProfile.professionalInfo.yearsOfExperience"),
      value: t("engineerProfile.professionalInfo.yearsOfExperienceValue", {
        count: years,
      }),
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-lg grid place-items-center shrink-0 ${stat.accent}`}
                  >
                    <StatIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold text-foreground leading-none">
                      {stat.value}
                      <span className="ms-1 text-xs font-medium text-muted-foreground">
                        {stat.suffix}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-primary px-6 py-5">
          <h2 className="relative z-10 text-lg font-bold text-white">
            {t("engineerProfile.about.title")}
          </h2>
          <p className="relative z-10 mt-0.5 text-sm text-white/80">
            {t("engineerProfile.about.subtitle")}
          </p>
        </div>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {t("engineerProfile.about.bio")}
          </h3>
          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
            {profile.professionalInfo.bio}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {t("engineerProfile.professionalTitle", {
              defaultValue: "Professional Information",
            })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {professionalRows.map((row) => {
              const RowIcon = row.icon;
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-200/30 p-3.5"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-soft text-emerald grid place-items-center shrink-0">
                    <RowIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground break-words">
                      {row.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BioSection;
