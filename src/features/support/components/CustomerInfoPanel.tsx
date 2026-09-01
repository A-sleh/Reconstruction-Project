import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { mockCustomerTickets } from "../mock";
import type { TicketCustomer } from "../api/types";

interface CustomerInfoPanelProps {
  customer: TicketCustomer;
}

const CustomerInfoPanel = ({ customer }: CustomerInfoPanelProps) => {
  const { t } = useTranslation();
  const previousTickets = mockCustomerTickets;

  const joinDate = customer.join_date
    ? new Date(customer.join_date).toLocaleDateString()
    : "-";

  return (
    <aside className="w-full overflow-y-auto border-s border-border bg-white p-5 lg:w-80 shrink-0">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {t("support.agent.workspace.customerCard", "Customer Information")}
      </h3>

      <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <h4 className="text-sm font-bold text-foreground">{customer.name}</h4>
        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
          {t(`support.agent.role.${customer.role}`, customer.role)}
        </span>
      </div>

      <div className="mb-5 space-y-3 border-b border-border pb-5 text-xs text-muted-foreground">
        <p className="flex justify-between gap-2">
          <b className="text-foreground">
            {t("support.agent.workspace.email", "Email:")}
          </b>
          <span className="break-all text-end text-foreground">
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
        <h4 className="mb-3 text-xs font-bold text-foreground">
          {t(
            "support.agent.workspace.previousTickets",
            "Customer previous tickets ({count})",
            { count: customer.previous_tickets_count },
          )}
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
                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <div className="text-[11px] font-bold text-foreground">
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

export default CustomerInfoPanel;
