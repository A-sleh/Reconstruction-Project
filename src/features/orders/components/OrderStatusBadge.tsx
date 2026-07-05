import { Badge } from "@/components/ui/Badge";
import { OrderStatus } from "@/features/orders/api/types";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  PendingApproval:
    "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  Suspended:
    "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  Preparing:
    "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
  Completed:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      {status}
    </Badge>
  );
}
