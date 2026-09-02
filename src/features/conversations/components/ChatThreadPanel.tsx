import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";
import type { Conversation, ChatMessage } from "../api/types";
import { CURRENT_USER_ID, ROLE_LABEL_KEYS } from "../constants";
import ChatAvatar from "./ChatAvatar";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatComposer from "./ChatComposer";

interface Props {
  conversation: Conversation | null;
  messages: ChatMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
}

const ChatThreadPanel = ({
  conversation,
  messages,
  isSending,
  onSend,
}: Props) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 px-4 py-20 text-center">
        <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("conversations.thread.noSelectionTitle")}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {t("conversations.thread.noSelectionDescription")}
        </p>
      </div>
    );
  }

  const { participant } = conversation;

  return (
    <div className="flex h-full min-h-[60vh] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        <ChatAvatar
          participant={participant}
          isOnline={participant.isOnline}
          showStatus
          size="md"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {participant.firstName} {participant.lastName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(ROLE_LABEL_KEYS[participant.role])}
            {participant.title && (
              <span className="ms-1 text-muted-foreground/50">
                · {participant.title}
              </span>
            )}
          </p>
        </div>
        <span className="ms-auto text-xs text-muted-foreground">
          {participant.isOnline
            ? t("conversations.thread.online")
            : t("conversations.thread.offline")}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-muted-foreground">
              {t("conversations.thread.empty")}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              participant={participant}
              isCurrentUser={message.senderId === CURRENT_USER_ID}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <ChatComposer onSend={onSend} isSending={isSending} />
    </div>
  );
};

export default ChatThreadPanel;