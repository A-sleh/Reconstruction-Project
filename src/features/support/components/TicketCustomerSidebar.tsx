import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { mockCustomerTickets } from "../mock";
import type { TicketCustomer } from "@/features/support/api/types";

interface TicketCustomerSidebarProps {
  customer: TicketCustomer;
}

const TicketCustomerSidebar = ({ customer }: TicketCustomerSidebarProps) => {
  const { t } = useTranslation();
  const previousTickets = mockCustomerTickets;

  const joinDate = customer.join_date
    ? new Date(customer.join_date).toLocaleDateString()
    : "-";

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border-s border-border p-5 overflow-y-auto">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        {t("support.agent.workspace.customerCard", "Customer Information")}
      </h3>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5">
        <h4 className="font-bold text-sm text-foreground">{customer.name}</h4>
        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
          {t(`support.agent.role.${customer.role}`, customer.role)}
        </span>
      </div>

      <div className="space-y-3 text-xs text-muted-foreground border-b border-border pb-5 mb-5">
        <p className="flex justify-between gap-2">
          <b className="text-foreground">
            {t("support.agent.workspace.email", "Email:")}
          </b>
          <span className="text-foreground break-all text-end">
            {customer.email}
          </span>
        </p>
        <p className="flex justify-between gap-2">
          <b className="text-foreground">
            {t("support.agent.workspace.accountId", "Account ID:")}
          </b>
          <span className="font-mono text-foreground">{customer.id}</span>
        </p>
        <p className="flex justify-between gap-2">
          <b className="text-foreground">
            {t("support.agent.workspace.joinDate", "Join date:")}
          </b>
          <span className="text-foreground">{joinDate}</span>
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-foreground mb-3">
          {t("support.agent.workspace.previousTickets", "Customer previous tickets ({count})", {
            count: customer.previous_tickets_count,
          })}
        </h4>
        <div className="space-y-2 text-xs">
          {previousTickets.length === 0 && (
            <p className="text-muted-foreground">-</p>
          )}
          {previousTickets.map((ticket) => {
            const isResolved = ticket.status === "resolved";
            const resolvedDate = ticket.resolved_at
              ? new Date(ticket.resolved_at).toLocaleDateString()
              : "-";

            return (
              <div
                key={ticket.ticket_id}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="font-bold text-foreground text-[11px]">
                  {ticket.subject}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    isResolved ? "text-emerald-600" : "text-muted-foreground",
                  )}
                >
                  {t("support.agent.workspace.resolvedBadge", "Resolved • {date}", {
                    date: resolvedDate,
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default TicketCustomerSidebar;
