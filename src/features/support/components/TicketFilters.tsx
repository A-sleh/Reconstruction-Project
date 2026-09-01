import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TicketPriority, TicketStatus, Role } from "../api/types";

export interface TicketFilterState {
  search: string;
  status: TicketStatus | "all";
  priority: TicketPriority | "all";
  role: Role | "all";
}

const STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in_progress",
  "pending_customer",
  "resolved",
  "closed",
];

const PRIORITY_OPTIONS: TicketPriority[] = ["urgent", "high", "medium", "low"];

const ROLE_OPTIONS: Role[] = ["Investor", "Provider", "Engineer", "Admin"];

interface TicketFiltersProps {
  filters: TicketFilterState;
  onChange: (filters: TicketFilterState) => void;
}

const TicketFilters = ({ filters, onChange }: TicketFiltersProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const update = (patch: Partial<TicketFilterState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t(
              "support.agent.inbox.searchPlaceholder",
              "Search by ticket number, customer name...",
            )}
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="ps-9 w-full"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v as TicketStatus | "all" })}
        >
          <SelectTrigger dir={isArabic ? "rtl" : "ltr"} className="w-full md:w-40">
            <SelectValue
              placeholder={t("support.agent.filters.allStatuses", "All statuses")}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("support.agent.filters.allStatuses", "All statuses")}
            </SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {t(`support.agent.status.${status}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.priority}
          onValueChange={(v) =>
            update({ priority: v as TicketPriority | "all" })
          }
        >
          <SelectTrigger dir={isArabic ? "rtl" : "ltr"} className="w-full md:w-40">
            <SelectValue
              placeholder={t("support.agent.filters.allPriorities", "All priorities")}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("support.agent.filters.allPriorities", "All priorities")}
            </SelectItem>
            {PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {t(`support.agent.priority.${priority}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.role}
          onValueChange={(v) => update({ role: v as Role | "all" })}
        >
          <SelectTrigger dir={isArabic ? "rtl" : "ltr"} className="w-full md:w-40">
            <SelectValue
              placeholder={t("support.agent.filters.allRoles", "All roles")}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("support.agent.filters.allRoles", "All roles")}
            </SelectItem>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {t(`support.agent.role.${role}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TicketFilters;
