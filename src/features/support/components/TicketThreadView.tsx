import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TicketThread } from "../api/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import CsatSection from "./CsatSection";

interface TicketThreadViewProps {
  thread: TicketThread;
  onBack: () => void;
  onSendMessage: (content: string) => void;
  onRate: (rating: number, feedback: string) => void;
}

const TicketThreadView = ({
  thread,
  onBack,
  onSendMessage,
  onRate,
}: TicketThreadViewProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [draft, setDraft] = useState("");

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;
    onSendMessage(content);
    setDraft("");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-card">
      <div className="border-b border-gray-300 px-4 py-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ms-2">
          <BackIcon className="h-4 w-4" />
          {t("support.supportCenter.thread.back")}
        </Button>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {thread.subject}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("support.supportCenter.thread.department", {
                department: thread.department,
              })}{" "}
              · #{thread.ticket_id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TicketPriorityBadge priority={thread.priority} />
            <TicketStatusBadge status={thread.status} />
          </div>
        </div>
      </div>

      <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto bg-muted/30 px-4 py-4">
        {thread.messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("support.supportCenter.thread.emptyMessages")}
          </p>
        ) : (
          thread.messages.map((message) => {
            const isOwn = message.sender_type === "customer";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  isOwn ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-card",
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-foreground",
                  )}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        isOwn ? "bg-white/20" : "bg-primary/10 text-primary",
                      )}
                    >
                      {message.avatar_initial}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isOwn ? "text-white/90" : "text-muted-foreground",
                      )}
                    >
                      {message.sender_name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px]",
                        isOwn ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {message.created_at}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-gray-300 px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={t("support.supportCenter.thread.replyPlaceholder")}
            className="h-11"
          />
          <Button onClick={handleSend} className="shrink-0" disabled={!draft.trim()}>
            <Send className="h-4 w-4" />
            {t("support.supportCenter.thread.send")}
          </Button>
        </div>
      </div>

      {thread.can_rate && (
        <div className="border-t border-gray-300 px-4 py-4">
          <CsatSection onSubmit={onRate} />
        </div>
      )}
    </div>
  );
};

export default TicketThreadView;
