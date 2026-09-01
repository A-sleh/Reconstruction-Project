import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Send } from "lucide-react";
import type { TicketDetails } from "../api/types";
import CannedResponsePicker, {
  type CannedOption,
} from "./CannedResponsePicker";
import InternalNoteBubble from "./InternalNoteBubble";

type ReplyMode = "reply" | "internal";

interface TicketWorkspacePanelProps {
  details: TicketDetails;
  cannedResponses?: CannedOption[];
  onSendMessage: (content: string, isInternal: boolean) => void;
}

const TicketWorkspacePanel = ({
  details,
  cannedResponses = [],
  onSendMessage,
}: TicketWorkspacePanelProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ReplyMode>("reply");
  const [content, setContent] = useState("");
  const [selectedCanned, setSelectedCanned] = useState("");

  const handleSelectCanned = (cannedContent: string, id: string) => {
    setSelectedCanned(id);
    setContent(cannedContent);
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSendMessage(trimmed, mode === "internal");
    setContent("");
    setSelectedCanned("");
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-muted/40">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-foreground">
            {details.subject}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(
              "support.agent.workspace.department",
              "Department: {department}",
              { department: details.department },
            )}
            <span className="mx-1">•</span>
            {t("support.agent.workspace.priorityLabel", "Priority: {priority}", {
              priority: t(
                `support.agent.priority.${details.priority}`,
                details.priority,
              ),
            })}
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 bg-amber-50 text-amber-700 border-amber-200"
        >
          {t(`support.agent.status.${details.status}`, details.status)}
        </Badge>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-muted/40 p-4">
        {details.messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("support.agent.workspace.noMessages", "No messages yet")}
          </p>
        )}
        {details.messages.map((message) => {
          if (message.is_internal_note) {
            return (
              <InternalNoteBubble
                key={message.id}
                senderName={message.sender_name}
                content={message.content}
                createdAt={message.created_at}
              />
            );
          }
          const isCustomer = message.sender_type === "customer";
          return (
            <div
              key={message.id}
              className="flex gap-3 max-w-2xl"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {(message.sender_name?.trim().charAt(0) || "؟").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {message.sender_name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border p-3 text-sm leading-relaxed text-foreground",
                    isCustomer
                      ? "rounded-tl-none border-gray-300 bg-white"
                      : "rounded-tr-none border-blue-200 bg-blue-50",
                  )}
                >
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 space-y-3 border-t border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "reply" ? "default" : "outline"}
              onClick={() => setMode("reply")}
            >
              {t("support.agent.workspace.replyToCustomer", "Reply to customer")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMode("internal")}
              className={cn(
                mode === "internal" &&
                  "bg-amber-100 text-amber-800 border-amber-200",
              )}
            >
              <Lock />
              {t("support.agent.workspace.addInternalNote", "Add internal note")}
            </Button>
          </div>

          <CannedResponsePicker
            options={cannedResponses}
            value={selectedCanned}
            onSelect={handleSelectCanned}
          />
        </div>

        <Textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(
            mode === "reply"
              ? "support.agent.workspace.replyPlaceholder"
              : "support.agent.workspace.internalPlaceholder",
            mode === "reply"
              ? "Type your reply to the customer here..."
              : "Type an internal note (hidden from customer)...",
          )}
        />

        <div className="flex justify-end">
          <Button
            variant="default"
            disabled={!content.trim()}
            onClick={handleSend}
          >
            <Send />
            {t("support.agent.workspace.send", "Send")}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default TicketWorkspacePanel;
