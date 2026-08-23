import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { ProjectStatus } from "../api/types";
import { getProjectStatusStyle } from "./ProjectStatusStyle";

export const ProjectStatusBadge = ({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) => {
  const { t } = useTranslation();
  const style = getProjectStatusStyle(status);
  const StatusIcon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.className,
        className,
      )}
    >
      <StatusIcon className="h-3.5 w-3.5" />
      {t(`project.status.${status}`)}
    </span>
  );
};
