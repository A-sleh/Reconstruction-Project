import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { AgentTicket } from "../api/types";
import TicketFilters, {
  type TicketFilterState,
} from "./TicketFilters";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import SlaCountdown from "./SlaCountdown";

const ROLE_STYLES: Record<string, string> = {
  Investor: "bg-blue-50 text-blue-700 border-blue-100",
  Provider: "bg-amber-50 text-amber-700 border-amber-100",
  Engineer: "bg-violet-50 text-violet-700 border-violet-100",
  Admin: "bg-gray-100 text-gray-700 border-gray-200",
};

const DEFAULT_FILTERS: TicketFilterState = {
  search: "",
  status: "all",
  priority: "all",
  role: "all",
};

interface TicketInboxPanelProps {
  tickets: AgentTicket[];
  total: number;
  isLoading?: boolean;
  onOpenTicket: (ticketId: string) => void;
  selectedTicketId?: string | null;
}

const TicketInboxPanel = ({
  tickets,
  total,
  isLoading = false,
  onOpenTicket,
  selectedTicketId,
}: TicketInboxPanelProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [filters, setFilters] = useState<TicketFilterState>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 500);

  const filteredTickets = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus =
        filters.status === "all" || ticket.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || ticket.priority === filters.priority;
      const matchesRole =
        filters.role === "all" || ticket.customer_role === filters.role;
      const matchesSearch =
        !query ||
        ticket.ticket_id.toLowerCase().includes(query) ||
        ticket.customer_name.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query);
      return (
        matchesStatus && matchesPriority && matchesRole && matchesSearch
      );
    });
  }, [tickets, debouncedSearch, filters]);

  return (
    <div className="space-y-4 w-full" dir={isArabic ? "rtl" : "ltr"}>
      <TicketFilters filters={filters} onChange={setFilters} />
      <span className="block text-xs text-muted-foreground">
        {t("support.agent.inbox.total", { count: total })}
      </span>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <span className="text-sm text-muted-foreground">
                      {t("support.agent.inbox.loading", "Loading tickets...")}
                    </span>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
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
              {!isLoading &&
                filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.ticket_id}
                    className={
                      selectedTicketId === ticket.ticket_id
                        ? "bg-primary/5"
                        : "cursor-pointer"
                    }
                    onClick={() => onOpenTicket(ticket.ticket_id)}
                  >
                    <TableCell className="font-mono font-bold text-foreground">
                      #{ticket.ticket_id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-bold text-foreground">
                          {ticket.customer_name}
                        </div>
                        <span
                          className={`mt-0.5 inline-block rounded border px-1.5 py-0.5 text-xs font-semibold ${
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
                    <TableCell>
                      <SlaCountdown minutes={ticket.sla_due_in_minutes} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTicket(ticket.ticket_id);
                        }}
                      >
                        {t("support.agent.inbox.openTicket")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TicketInboxPanel;
