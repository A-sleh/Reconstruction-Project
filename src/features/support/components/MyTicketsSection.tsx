import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { SupportTicket } from "../api/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";

interface MyTicketsSectionProps {
  tickets: SupportTicket[];
  onOpenTicket: (id: string) => void;
  onCreateTicket: () => void;
}

const MyTicketsSection = ({
  tickets,
  onOpenTicket,
  onCreateTicket,
}: MyTicketsSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-lg border border-gray-300 bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-gray-300 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {t("support.supportCenter.myTickets.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("support.supportCenter.myTickets.description")}
          </p>
        </div>
        <Button onClick={onCreateTicket}>
          <Plus className="h-4 w-4" />
          {t("support.supportCenter.myTickets.create")}
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">
            {t("support.supportCenter.myTickets.empty")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("support.supportCenter.myTickets.emptyHint")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-300">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <button
                type="button"
                onClick={() => onOpenTicket(ticket.id)}
                className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-smooth hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {ticket.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{ticket.id}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold text-foreground">
                    {ticket.subject}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {ticket.category}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <TicketPriorityBadge priority={ticket.priority} />
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MyTicketsSection;
