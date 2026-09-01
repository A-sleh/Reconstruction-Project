import { useTranslation } from "react-i18next";
import type { VerificationStatus } from "../api/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
};

interface PropertyStatusBadgeProps {
  status: VerificationStatus;
}

const PropertyStatusBadge = ({ status }: PropertyStatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {t(`buildingVerification.status.${status}`, status)}
    </span>
  );
};

export default PropertyStatusBadge;
