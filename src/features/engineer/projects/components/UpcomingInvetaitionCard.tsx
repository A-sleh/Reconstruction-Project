import { motion } from "framer-motion";
import { Check, X, Building2, MapPin, CalendarDays, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import type { EngineerInvite } from "../api/types";
import InviteStatusBadge from "./InviteStatusBadge";
import InviteAcceptModal from "./InviteAcceptModal";
import InviteDeclineModal from "./InviteDeclineModal";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

interface Props {
  invite: EngineerInvite;
  index?: number;
}

const UpcomingInvetaitionCard = ({ invite, index = 0 }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const sentAt = new Date(invite.sentAt).toLocaleDateString(
    isArabic ? "ar-SY" : "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  const isPending = invite.status === "PENDING";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex h-full flex-col rounded-xl border border-gray-300 bg-white p-5 shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          {invite.avatarUrl ? (
            <img
              src={invite.avatarUrl}
              alt={invite.fromName}
              loading="lazy"
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/10"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-hover text-sm font-bold text-white ring-2 ring-primary/10">
              {initialsOf(invite.fromName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <h3
                title={invite.fromName}
                className="truncate text-base font-bold text-foreground"
              >
                {invite.fromName}
              </h3>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {invite.fromTitle}
            </p>
          </div>
        </div>

        <InviteStatusBadge status={invite.status} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 shrink-0 text-primary" />
          <span title={invite.projectName} className="truncate font-medium text-foreground">
            {invite.projectName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span title={invite.workSiteName} className="truncate">
            {invite.workSiteName}
          </span>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 min-h-0 flex-1 border-t border-dashed border-border pt-4 text-sm leading-6 text-muted-foreground">
        {invite.message}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="line-clamp-1 text-xs font-medium text-foreground">
            {t("engineerRequests.invite.fields.compensation")}: {invite.compensation}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {t("engineerRequests.invite.fields.sentAt")} {sentAt}
          </span>
        </div>
      </div>

      {isPending && (
        <div className="mt-4 flex items-center gap-2">
          <InviteAcceptModal
            invite={invite}
            openButton={
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700"
              >
                <Check className="h-4 w-4" />
                {t("engineerRequests.invite.actions.accept")}
              </Button>
            }
          />
          <InviteDeclineModal
            invite={invite}
            openButton={
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400"
              >
                <X className="h-4 w-4" />
                {t("engineerRequests.invite.actions.decline")}
              </Button>
            }
          />
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingInvetaitionCard;