import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-lg p-3 flex flex-col items-center text-center gap-2",
        className,
      )}
    >
      <div className={cn("p-2 rounded-full", iconBg)}>
        <span className={cn("h-4 w-4 block", iconColor)}>{icon}</span>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
