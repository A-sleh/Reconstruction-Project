import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { paths } from "@/config/paths";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TicketStatus } from "@/features/support/api/types";

const STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in_progress",
  "pending_customer",
  "resolved",
  "closed",
];

interface TicketWorkspaceHeaderProps {
  ticketId: string;
  status: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
  isUpdating?: boolean;
}

const TicketWorkspaceHeader = ({
  ticketId,
  status,
  onStatusChange,
  isUpdating = false,
}: TicketWorkspaceHeaderProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <header className="flex items-center justify-between gap-3 bg-white border-b border-border px-4 py-3 shrink-0">
      <div className="flex items-center gap-3">
        <Link
          to={paths.app.admin.support.path}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          {isArabic ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
          {t("support.agent.workspace.back", "Back to inbox")}
        </Link>
        <span className="text-border">|</span>
        <h1 className="text-sm font-bold text-foreground">
          {t("support.agent.workspace.ticketTitle", "Ticket #{id}", { id: ticketId })}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-muted-foreground">
          {t("support.agent.workspace.updateStatus", "Update ticket status:")}
        </label>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as TicketStatus)}
        >
          <SelectTrigger
            dir={isArabic ? "rtl" : "ltr"}
            disabled={isUpdating}
            className="min-w-36"
          >
            <SelectValue
              placeholder={t(`support.agent.status.${status}`, status)}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`support.agent.status.${option}`, option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default TicketWorkspaceHeader;
