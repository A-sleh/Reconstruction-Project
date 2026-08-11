import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import type { TicketMessage } from "@/features/support/api/types";

interface TicketMessagesListProps {
  messages: TicketMessage[];
}

const TicketMessagesList = ({ messages }: TicketMessagesListProps) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">
          {t("support.agent.workspace.noMessages", "No messages yet")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40">
      {messages.map((message) => {
        const isInternal = message.is_internal_note;

        if (isInternal) {
          return (
            <div key={message.id} className="flex gap-3 max-w-2xl">
              <div className="size-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-900">
                    {t("support.agent.workspace.internalNote", "Internal note ({name})", {
                      name: message.sender_name,
                    })}
                  </span>
                  <span className="text-[10px] text-amber-600">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className="flex gap-3 max-w-2xl">
            <div className="size-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
              {(message.sender_name?.trim().charAt(0) || "؟").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-foreground">
                  {message.sender_name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <div className="bg-white border border-gray-300 rounded-2xl rounded-tr-none p-3 text-sm leading-relaxed text-foreground">
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketMessagesList;
