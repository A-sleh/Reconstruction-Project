import {
  Camera,
  ClipboardCheck,
  FileText,
  LogIn,
  LogOut,
  ReceiptText,
  TrendingUp,
  Truck,
} from "lucide-react";
import type { EngineersProjectAction } from "../api/types";

export interface ActionMeta {
  icon: typeof LogIn;
  className: string;
  chip: string;
  color: string;
}

export const actionIcons: Record<EngineersProjectAction, ActionMeta> = {
  checked_in: {
    icon: LogIn,
    className: "text-emerald",
    chip: "bg-emerald-soft",
    color: "hsl(142 71% 45%)",
  },
  checked_out: {
    icon: LogOut,
    className: "text-muted-foreground",
    chip: "bg-muted",
    color: "hsl(220 9% 46%)",
  },
  daily_report: {
    icon: FileText,
    className: "text-primary",
    chip: "bg-primary/10",
    color: "hsl(var(--primary))",
  },
  progress_update: {
    icon: TrendingUp,
    className: "text-gold",
    chip: "bg-gold/15",
    color: "hsl(38 92% 50%)",
  },
  site_photos: {
    icon: Camera,
    className: "text-accent-foreground",
    chip: "bg-accent",
    color: "hsl(199 89% 48%)",
  },
  task_completed: {
    icon: ClipboardCheck,
    className: "text-emerald",
    chip: "bg-emerald-soft",
    color: "hsl(142 71% 45%)",
  },
  material_request: {
    icon: Truck,
    className: "text-warning-foreground",
    chip: "bg-warning/15",
    color: "hsl(28 87% 55%)",
  },
  invoice_added: {
    icon: ReceiptText,
    className: "text-destructive",
    chip: "bg-destructive/10",
    color: "hsl(0 84% 60%)",
  },
};