import { Building2, CalendarDays, CircleAlert, FileText, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { EngineerJoinRequest } from "../api/types";
import JoinRequestStatusBadge from "./JoinRequestStatusBadge";
import JoinRequestCancelConfirm from "./JoinRequestCancelConfirm";

interface Props {
  request: EngineerJoinRequest;
}

const ProjectCard = ({ request }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const sentAt = new Date(request.sentAt).toLocaleDateString(
    isArabic ? "ar-SY" : "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );
  const repliedAt = request.repliedAt
    ? new Date(request.repliedAt).toLocaleDateString(
        isArabic ? "ar-SY" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : null;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-300 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Send className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3
              title={request.projectName}
              className="truncate text-sm font-semibold text-foreground"
            >
              {request.projectName}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span title={request.workSiteName} className="truncate">
                {request.workSiteName}
              </span>
            </p>
          </div>
        </div>

        <JoinRequestStatusBadge status={request.status} />
      </div>

      <div className="mt-4 flex-1 space-y-2">
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
            {request.note}
          </p>
        </div>

        {request.status === "REJECTED" && request.rejectionReason && (
          <div className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
            <span className="line-clamp-2 text-xs italic leading-4 text-destructive">
              {request.rejectionReason}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-border pt-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          {t("engineerRequests.request.columns.sentAt")} {sentAt}
        </span>
        {repliedAt && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            {repliedAt}
          </span>
        )}
        {request.status === "PENDING" ? (
          <JoinRequestCancelConfirm request={request} />
        ) : (
          <span className="w-4" />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;