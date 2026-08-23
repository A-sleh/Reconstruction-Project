import {
  CheckCircle2,
  Construction,
  PauseCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ProjectStatus } from "../api/types";

export interface ProjectStatusStyle {
  className: string;
  icon: LucideIcon;
  accent: string;
}

const statusStyles: Record<ProjectStatus, ProjectStatusStyle> = {
  Initializing: {
    className: "bg-primary/10 text-primary",
    icon: Construction,
    accent: "bg-primary",
  },
  InProgress: {
    className: "bg-emerald-soft text-emerald",
    icon: Construction,
    accent: "bg-emerald",
  },
  Suspended: {
    className: "bg-warning/10 text-warning",
    icon: PauseCircle,
    accent: "bg-warning",
  },
  Canceled: {
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
    accent: "bg-destructive",
  },
  Done: {
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
    accent: "bg-success",
  },
};

const fallbackStatusStyle: ProjectStatusStyle = {
  className: "bg-muted text-muted-foreground",
  icon: Construction,
  accent: "bg-muted",
};

export const getProjectStatusStyle = (
  status: ProjectStatus,
): ProjectStatusStyle => statusStyles[status] ?? fallbackStatusStyle;
