import { OrderItemStatus, OrderStatus } from "@/features/orders/api/types";

type AllStatuses = OrderStatus | OrderItemStatus;

const styles: Record<AllStatuses, { bg: string; text: string; dot: string }> = {
  PendingApproval: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  Preparing: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  Completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Suspended: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  CancelledByClient: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  CancelledByProvider: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

export function OrderStatusBadge({ status }: { status: AllStatuses }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
