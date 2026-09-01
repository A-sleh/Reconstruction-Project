import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { BoardPriority } from "../api/types";

const PRIORITY_STYLES: Record<BoardPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const PriorityBadge = ({ priority }: { priority: BoardPriority }) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        PRIORITY_STYLES[priority],
      )}
    >
      {t(`projectBoard.priority.${priority}`)}
    </span>
  );
};

export default PriorityBadge;
