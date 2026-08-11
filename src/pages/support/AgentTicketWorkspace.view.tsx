import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { mockTicketDetails } from "@/features/support/mock";
import type { TicketStatus } from "@/features/support/api/types";
import TicketWorkspaceHeader from "@/features/support/components/TicketWorkspaceHeader";
import TicketMessagesList from "@/features/support/components/TicketMessagesList";
import TicketReplyBox from "@/features/support/components/TicketReplyBox";
import TicketCustomerSidebar from "@/features/support/components/TicketCustomerSidebar";

const AgentTicketWorkspace = () => {
  const { ticketId = mockTicketDetails.ticket_id } = useParams<{
    ticketId: string;
  }>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const data = mockTicketDetails;
  const [status, setStatus] = useState<TicketStatus>(data.status);

  return (
    <div
      className="flex flex-col min-h-screen bg-background"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <TicketWorkspaceHeader
        ticketId={ticketId}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 bg-muted/40">
          <div className="bg-white p-4 border-b border-border flex justify-between items-center gap-3">
            <div className="min-w-0">
              <h2 className="font-bold text-foreground text-base truncate">
                {data.subject}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(
                  "support.agent.workspace.department",
                  "Department: {department}",
                  { department: data.department },
                )}
                <span className="mx-1">•</span>
                {t(
                  "support.agent.workspace.priorityLabel",
                  "Priority: {priority}",
                  {
                    priority: t(
                      `support.agent.priority.${data.priority}`,
                      data.priority,
                    ),
                  },
                )}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 shrink-0"
            >
              {t(`support.agent.status.${status}`, status)}
            </Badge>
          </div>

          <TicketMessagesList messages={data.messages} />
          <TicketReplyBox ticketId={ticketId} />
        </main>

        {data.customer && <TicketCustomerSidebar customer={data.customer} />}
      </div>
    </div>
  );
};

export default AgentTicketWorkspace;
