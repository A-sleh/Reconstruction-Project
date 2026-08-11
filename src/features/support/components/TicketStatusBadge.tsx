import { useTranslation } from "react-i18next";
import type { TicketStatus } from "../api/types";

const STYLES: Record<TicketStatus, string> = {
  open: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-50 text-amber-700",
  pending_customer: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-gray-200 text-gray-600",
};

const TicketStatusBadge = ({ status }: { status: TicketStatus }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
        STYLES[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {t(`support.agent.status.${status}`)}
    </span>
  );
};

export default TicketStatusBadge;
