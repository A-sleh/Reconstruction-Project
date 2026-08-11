import { useTranslation } from "react-i18next";
import type { TicketPriority } from "../api/types";

const STYLES: Record<TicketPriority, string> = {
  urgent: "bg-rose-50 text-rose-700",
  high: "bg-orange-50 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const TicketPriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
        STYLES[priority] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {t(`support.agent.priority.${priority}`)}
    </span>
  );
};

export default TicketPriorityBadge;
