import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { RequestStatus } from "../api";

const config: Record<RequestStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-warning/15 text-warning border-warning/30" },
  partial: { label: "Partially Fulfilled", cls: "bg-[hsl(217_70%_35%/0.15)] text-primary border-primary/30" },
  completed: { label: "Completed", cls: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const c = config[status];
  return (
    <Badge variant="outline" className={cn("font-medium", c.cls)}>
      {c.label}
    </Badge>
  );
}
