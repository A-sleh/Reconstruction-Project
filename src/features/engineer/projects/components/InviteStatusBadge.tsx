import { useTranslation } from "react-i18next";
import type { EngineerInviteStatus } from "../api/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  ACCEPTED: "bg-success/10 text-success",
  DECLINED: "bg-destructive/10 text-destructive",
};

const InviteStatusBadge = ({ status }: { status: EngineerInviteStatus }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {t(`engineerRequests.invite.status.${status}`, status)}
    </span>
  );
};

export default InviteStatusBadge;
