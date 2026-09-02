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

import useAuthStore from "@/stores/useAuthStore";

import type {
  EngineerProfile,
  EngineerVerificationStatus,
} from "../api/engineer-profile";
import EditProfileModal from "./EditProfileModal";

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

interface Props {
  profile: EngineerProfile;
  isLoading?: boolean;
  onUpdate?: (updates: Partial<EngineerProfile>) => void;
}

const ProfileHeader = ({
  profile,
  isLoading = false,
  onUpdate,
}: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const role = useAuthStore((s) => s.role);
  const isOwner = role === "Engineer";

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 shadow-card p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 bg-card p-3"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-3 w-16 mt-2" />
              <Skeleton className="h-4 w-24 mt-1.5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
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
      value: String(profile.syndicateId),
      icon: IdCard,
    },
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
      icon: FileBadge,
    },
    {
      label: t("engineerProfile.professionalInfo.licenseNumber"),
      value: profile.professionalInfo.licenseNumber,
      icon: FileBadge,
    },
    {
      label: t("engineerProfile.professionalInfo.yearsOfExperience"),
      value: t(
        "engineerProfile.professionalInfo.yearsOfExperienceValue",
        { count: profile.professionalInfo.yearsOfExperiece },
      ),
      icon: BriefcaseBusiness,
    },
    {
      label: t("engineerProfile.professionalInfo.contributedProjects"),
      value: String(profile.numberOfProjectsContributed),
      icon: BadgeCheck,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-300 shadow-card p-6 lg:p-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="relative shrink-0">
          {profile.photo?.url ? (
            <img
              src={profile.photo.url}
              alt={fullName}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-emerald-soft"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-primary text-white grid place-items-center ring-4 ring-emerald-soft">
              {initials ? (
                <span className="text-2xl font-bold">{initials}</span>
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
          )}
          {profile.verificationStatus === "VERIFIED" && (
            <span className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full bg-success text-white ring-4 ring-white">
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {fullName}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${verificationStyle.className}`}
            >
              <VerificationIcon className="h-3.5 w-3.5" />
              {t(
                `engineerProfile.verificationStatus.${profile.verificationStatus}`,
                { defaultValue: profile.verificationStatus },
              )}
            </span>
            {isOwner && onUpdate && (
              <div className="ms-auto">
                <EditProfileModal profile={profile} onUpdate={onUpdate} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground">
              {profile.identifier}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
              {t(`engineerProfile.speciality.${profile.speciality}`, {
                defaultValue: profile.speciality,
              })}
            </span>
          </div>

          {profile.professionalInfo.bio && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {profile.professionalInfo.bio}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {infoTiles.map((tile) => {
          const TileIcon = tile.icon;
          return (
            <div
              key={tile.label}
              className="rounded-lg border border-gray-300 bg-card p-3 flex items-start gap-3"
            >
              <div className="h-9 w-9 rounded-lg bg-emerald-soft text-emerald grid place-items-center shrink-0">
                <TileIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{tile.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground break-words">
                  {tile.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
