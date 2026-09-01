import { useTranslation } from "react-i18next";
import type { EngineerJoinRequestStatus } from "../api/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELED: "bg-muted text-muted-foreground",
};

const JoinRequestStatusBadge = ({
  status,
}: {
  status: EngineerJoinRequestStatus;
}) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {t(`engineerRequests.request.status.${status}`, status)}
    </span>
  );
};

export default JoinRequestStatusBadge;
