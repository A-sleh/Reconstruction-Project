import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock,
  FileBadge,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type {
  EngineerVerificationStatus,
  PublicEngineerProfile,
} from "@/features/engineer/profile/api/types";

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

export default function EngineerHero({
  engineer,
}: {
  engineer: PublicEngineerProfile;
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const fullName = `${engineer.first_name} ${engineer.last_name}`;
  const initials =
    `${engineer.first_name?.[0] ?? ""}${engineer.last_name?.[0] ?? ""}`.toUpperCase();
  const verificationStyle =
    verificationStyles[engineer.verificationStatus] ?? fallbackVerificationStyle;
  const VerificationIcon = verificationStyle.icon;
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <section className="gradient-hero text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
        >
          <BackIcon className="h-4 w-4" />
          {t("publicEngineer.back")}
        </motion.button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative shrink-0"
          >
            {engineer.photo_url ? (
              <img
                src={engineer.photo_url}
                alt={fullName}
                className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-elegant"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-gradient-primary text-white grid place-items-center shadow-elegant">
                {initials ? (
                  <span className="text-3xl font-bold">{initials}</span>
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
            )}
            {engineer.verificationStatus === "VERIFIED" && (
              <span className="absolute -bottom-1 -end-1 flex h-9 w-9 items-center justify-center rounded-full bg-success text-white ring-4 ring-white/40">
                <BadgeCheck className="h-5 w-5" />
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-3xl md:text-4xl font-bold">{fullName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                {t(`engineerProfile.speciality.${engineer.speciality}`, {
                  defaultValue: engineer.speciality,
                })}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${verificationStyle.className}`}
              >
                <VerificationIcon className="h-3.5 w-3.5" />
                {t(
                  `engineerProfile.verificationStatus.${engineer.verificationStatus}`,
                  { defaultValue: engineer.verificationStatus },
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
                <FileBadge className="h-4 w-4" />
                {t("publicEngineer.license")}:{" "}
                {engineer.professionalInfo.licenseNumber}
              </span>
            </div>
            {engineer.professionalInfo.bio && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85">
                {engineer.professionalInfo.bio}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <a
              href={`tel:${engineer.phone}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {engineer.phone}
            </a>
            <a
              href={`mailto:${engineer.email}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {engineer.email}
            </a>
            <Button
              size="sm"
              className="mt-2 w-full bg-white text-primary hover:bg-white/90"
              onClick={() =>
                document
                  .getElementById("public-engineer-contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("publicEngineer.contact.title")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
