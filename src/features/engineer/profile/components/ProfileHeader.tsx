import { Skeleton } from "@/components/ui/Skeleton";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock,
  FileBadge,
  HardHat,
  IdCard,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useEngineerProfile } from "../api/query";
import type { EngineerVerificationStatus } from "../api/types";
import { MOCK_ENGINEER_PROFILE } from "../mock/profile";

const verificationStyles: Record<
  EngineerVerificationStatus,
  { className: string; icon: typeof BadgeCheck }
> = {
  VERIFIED: { className: "bg-success/10 text-success", icon: BadgeCheck },
  PENDING: { className: "bg-warning/10 text-warning", icon: Clock },
  REJECTED: { className: "bg-destructive/10 text-destructive", icon: XCircle },
};

const fallbackVerificationStyle = {
  className: "bg-muted text-muted-foreground",
  icon: BadgeCheck,
};

const ProfileHeader = () => {
  const { t, i18n } = useTranslation();
  const { data: profile1, isLoading, isError, refetch } = useEngineerProfile();
  const isArabic = i18n.language === "ar";

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 shadow-card p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <Skeleton className="h-28 w-28 lg:h-32 lg:w-32 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-52" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 bg-card p-4"
            >
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-3 w-20 mt-3" />
              <Skeleton className="h-4 w-28 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // if (isError || !profile) {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 12 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       className="bg-white rounded-lg border border-gray-300 shadow-card p-6 lg:p-8"
  //       dir={isArabic ? "rtl" : "ltr"}
  //     >
  //       <div className="flex flex-col items-start gap-4">
  //         <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive grid place-items-center">
  //           <AlertTriangle className="h-6 w-6" />
  //         </div>
  //         <div>
  //           <h2 className="text-xl font-bold text-foreground">
  //             {t("engineerProfile.error.title")}
  //           </h2>
  //           <p className="mt-1 text-sm text-muted-foreground">
  //             {t("engineerProfile.error.message")}
  //           </p>
  //         </div>
  //         <Button size="sm" variant="outline" onClick={() => refetch()}>
  //           {t("engineerProfile.error.retry")}
  //         </Button>
  //       </div>
  //     </motion.div>
  //   );
  // }

  const profile = MOCK_ENGINEER_PROFILE;

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();
  const verificationStyle =
    verificationStyles[profile.verificationStatus] ?? fallbackVerificationStyle;
  const VerificationIcon = verificationStyle.icon;

  const infoTiles = [
    {
      label: t("engineerProfile.contact.email"),
      value: profile.email,
      icon: Mail,
    },
    {
      label: t("engineerProfile.contact.phone"),
      value: profile.phone,
      icon: Phone,
    },
    {
      label: t("engineerProfile.contact.syndicateId"),
      value: profile.syndicate_id,
      icon: IdCard,
    },
    {
      label: t("engineerProfile.professionalInfo.specialization"),
      value: t(`engineerProfile.speciality.${profile.speciality}`, {
        defaultValue: profile.speciality,
      }),
      icon: HardHat,
    },
    {
      label: t("engineerProfile.professionalInfo.yearsOfExperience"),
      value: t("engineerProfile.professionalInfo.yearsOfExperienceValue", {
        count: profile.professionalInfo.yearsOfExperience,
      }),
      icon: BriefcaseBusiness,
    },
    {
      label: t("engineerProfile.professionalInfo.licenseNumber"),
      value: profile.professionalInfo.licenseNumber,
      icon: FileBadge,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-300 shadow-card p-6 lg:p-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={`${fullName} ${t("engineerProfile.title")}`}
            className="h-28 w-28 lg:h-32 lg:w-32 rounded-full object-cover ring-4 ring-emerald-soft shrink-0"
          />
        ) : (
          <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-primary text-white grid place-items-center ring-4 ring-emerald-soft shrink-0">
            {initials ? (
              <span className="text-3xl lg:text-4xl font-bold">{initials}</span>
            ) : (
              <User className="h-12 w-12" />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {fullName}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground">
              {profile.identifier}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
              {t(`engineerProfile.speciality.${profile.speciality}`, {
                defaultValue: profile.speciality,
              })}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${verificationStyle.className}`}
            >
              <VerificationIcon className="h-3.5 w-3.5" />
              {t(
                `engineerProfile.verificationStatus.${profile.verificationStatus}`,
                { defaultValue: profile.verificationStatus },
              )}
            </span>
          </div>
          {profile.professionalInfo.bio && (
            <p className="mt-3 text-sm text-muted-foreground">
              {profile.professionalInfo.bio}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {infoTiles.map((tile) => {
          const TileIcon = tile.icon;
          return (
            <div
              key={tile.label}
              className="rounded-lg border border-gray-300 bg-card p-4"
            >
              <div className="h-9 w-9 rounded-lg bg-emerald-soft text-emerald grid place-items-center">
                <TileIcon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{tile.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground break-words">
                {tile.value}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
