import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-success/15 text-success border border-success/30",
  "on-hold": "bg-warning/15 text-warning-foreground border border-warning/40",
  completed: "bg-primary/10 text-primary border border-primary/20",
  "in-stock": "bg-success/15 text-success border border-success/30",
  "low-stock": "bg-accent/15 text-accent border border-accent/30",
  "out-of-stock": "bg-destructive/10 text-destructive border border-destructive/30",
};

const keyMap: Record<string, string> = {
  active: "workSites.status-active",
  "on-hold": "workSites.status-on-hold",
  completed: "workSites.status-completed",
  "in-stock": "workSites.resource.availability.in-stock",
  "low-stock": "workSites.resource.availability.low-stock",
  "out-of-stock": "workSites.resource.availability.out-of-stock",
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const label = keyMap[status] ? t(keyMap[status]) : status;

  return (
    <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-xs font-medium", styles[status])}>
      <span className="mx-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </Badge>
  );
}