import { BankItemStatus } from "@/features/category-bank/api/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  BankItemStatus,
  { bg: string; text: string; dot: string }
> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Accepted: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Resolved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

export default function BankItemStatusBadge({
  status,
}: {
  status: BankItemStatus;
}) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}
