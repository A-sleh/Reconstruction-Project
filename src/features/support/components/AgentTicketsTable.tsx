import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { mockAgentTickets } from "../mock";
import type { AgentTicket, TicketStatus } from "../api/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";

const STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in_progress",
  "pending_customer",
  "resolved",
  "closed",
];

const ROLE_STYLES: Record<string, string> = {
  Investor: "bg-blue-50 text-blue-700 border-blue-100",
  Provider: "bg-amber-50 text-amber-700 border-amber-100",
  Engineer: "bg-violet-50 text-violet-700 border-violet-100",
  Admin: "bg-gray-100 text-gray-700 border-gray-200",
};

function formatSla(minutes: number, t: (key: string, params?: object) => string) {
  if (minutes <= 0) {
    return { text: t("support.agent.sla.overdue"), danger: true };
  }
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const text =
      hours === 1
        ? t("support.agent.sla.hour")
        : t("support.agent.sla.hours", { count: hours });
    return { text, danger: false };
  }
  return {
    text: t("support.agent.sla.minutes", { count: minutes }),
    danger: minutes <= 30,
  };
}

const AgentTicketsTable = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const debouncedSearch = useDebounce(search, 500);

  const tickets = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return mockAgentTickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesSearch =
        !query ||
        ticket.ticket_id.toLowerCase().includes(query) ||
        ticket.customer_name.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [debouncedSearch, statusFilter]);

  const total = tickets.length;

  return (
    <div className="space-y-4 w-full" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "support.agent.inbox.searchPlaceholder",
                "Search by ticket number, customer name...",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | TicketStatus)
            }
          >
            <SelectTrigger
              className="w-full md:w-fit"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <SelectValue
                placeholder={t("support.agent.inbox.allStatuses", "All statuses")}
              />
            </SelectTrigger>
            <SelectContent dir={isArabic ? "rtl" : "ltr"}>
              <SelectItem value="all">
                {t("support.agent.inbox.allStatuses", "All statuses")}
              </SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`support.agent.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("support.agent.inbox.total", { count: total })}
        </span>
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("support.agent.inbox.ticketId")}</TableHead>
                <TableHead>{t("support.agent.inbox.customer")}</TableHead>
                <TableHead>{t("support.agent.inbox.subject")}</TableHead>
                <TableHead>{t("support.agent.inbox.priority")}</TableHead>
                <TableHead>{t("support.agent.inbox.status")}</TableHead>
                <TableHead>{t("support.agent.inbox.sla")}</TableHead>
                <TableHead>{t("support.agent.inbox.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {t("support.agent.inbox.empty", "No matching tickets")}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t(
                        "support.agent.inbox.emptyHint",
                        "Try changing the search or status filter",
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {tickets.map((ticket: AgentTicket) => {
                  const sla = formatSla(ticket.sla_due_in_minutes, t);
                  return (
                    <TableRow key={ticket.ticket_id}>
                      <TableCell className="font-mono font-bold text-foreground">
                        #{ticket.ticket_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-bold text-foreground">
                            {ticket.customer_name}
                          </div>
                          <span
                            className={`mt-0.5 inline-block border px-1.5 py-0.5 rounded text-xs font-semibold ${
                              ROLE_STYLES[ticket.customer_role] ??
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {t(`support.agent.role.${ticket.customer_role}`)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <TicketPriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <TicketStatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell
                        className={
                          sla.danger
                            ? "text-rose-600 font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {sla.text}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate("/app/admin/support")}
                        >
                          {t("support.agent.inbox.openTicket")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AgentTicketsTable;
