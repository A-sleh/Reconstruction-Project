import { useTranslation } from "react-i18next";
import type { EngineerVerificationStatus } from "../api/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  VERIFIED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
};

interface EngineerStatusBadgeProps {
  status: EngineerVerificationStatus;
}

const EngineerStatusBadge = ({ status }: EngineerStatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {t(`engineerVerification.status.${status}`)}
    </span>
  );
};

export default EngineerStatusBadge;
