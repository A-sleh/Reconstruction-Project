import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Conversation } from "../api/types";
import { CURRENT_USER_ID, ROLE_LABEL_KEYS, timeAgoMinutes } from "../constants";
import ChatAvatar from "./ChatAvatar";

interface Props {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, active, onClick }: Props) => {
  const { t } = useTranslation();
  const { participant } = conversation;
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isMine = lastMessage?.senderId === CURRENT_USER_ID;
  const minutes = timeAgoMinutes(conversation.lastMessageAt);

  const timeLabel =
    minutes < 1
      ? t("conversations.time.justNow")
      : minutes < 60
        ? t("conversations.time.minutes", { count: minutes })
        : minutes < 1440
          ? t("conversations.time.hours", { count: Math.floor(minutes / 60) })
          : t("conversations.time.days", { count: Math.floor(minutes / 1440) });

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-gray-100 px-3 py-3 text-start transition-colors",
        active ? "bg-primary/5" : "hover:bg-muted/40",
      )}
    >
      <ChatAvatar
        participant={participant}
        isOnline={participant.isOnline}
        showStatus
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {participant.firstName} {participant.lastName}
          </p>
          <span className="shrink-0 text-[10px] text-muted-foreground/70">
            {timeLabel}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-xs",
              active ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {isMine && <span className="font-medium">{t("conversations.list.you")}: </span>}
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>

        <p className="mt-1 text-[10px] text-muted-foreground/70">
          {t(ROLE_LABEL_KEYS[participant.role])}
          {participant.title && (
            <span className="ms-1 text-muted-foreground/50">· {participant.title}</span>
          )}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;