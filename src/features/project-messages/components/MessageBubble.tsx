import { useTranslation } from "react-i18next";
import { StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectChatParticipant, ProjectMessage } from "../api/types";

interface Props {
  message: ProjectMessage;
  sender: ProjectChatParticipant;
  isCurrentUser: boolean;
}

const MessageBubble = ({ message, sender, isCurrentUser }: Props) => {
  const { t } = useTranslation();
  const initials = sender.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex gap-2", isCurrentUser ? "flex-row-reverse" : "")}>
      {!isCurrentUser && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
            sender.avatarColor,
          )}
        >
          {initials}
        </span>
      )}

      <div
        className={cn(
          "max-w-[75%]",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm shadow-sm",
            message.type === "note"
              ? "bg-amber-100 text-amber-900"
              : isCurrentUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md",
          )}
        >
          {message.type === "note" && (
            <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              <StickyNote className="h-3 w-3" />
              {t("projectMessages.noteBadge")}
            </span>
          )}
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        <p
          className={cn(
            "mt-1 text-[10px] text-muted-foreground/70",
            isCurrentUser ? "text-end" : "text-start",
          )}
        >
          {!isCurrentUser && (
            <span className="me-1 font-medium">{sender.name}</span>
          )}
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;