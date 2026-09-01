import { Lock } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  label: string;
  hint?: string;
  icon?: ReactNode;
}

export default function SensitiveLockedRow({ label, hint, icon }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {icon ?? (
          <Lock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {hint && (
            <p className="mt-0.5 text-xs text-muted-foreground/60">{hint}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        Locked
      </span>
    </div>
  );
}
