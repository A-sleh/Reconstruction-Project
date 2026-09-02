import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { ChatParticipant } from "../api/types";
import ChatAvatar from "./ChatAvatar";

interface Props {
  message: {
    id: string;
    text: string;
    sentAt: string;
  };
  participant: Pick<
    ChatParticipant,
    "firstName" | "lastName" | "role" | "photoURL"
  >;
  isCurrentUser: boolean;
}

const ChatMessageBubble = ({ message, participant, isCurrentUser }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-SY" : "en-US";

  const time = new Date(message.sentAt).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Date(message.sentAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });

  return (
    <div className={cn("flex gap-2", isCurrentUser && "flex-row-reverse")}>
      {!isCurrentUser && <ChatAvatar participant={participant} size="sm" />}

      <div className={cn("max-w-[75%]", isCurrentUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm shadow-sm",
            isCurrentUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-muted text-foreground",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        <p
          className={cn(
            "mt-1 text-[10px] text-muted-foreground/70",
            isCurrentUser ? "text-end" : "text-start",
          )}
        >
          {t("conversations.list.you")}: {time}
          {" · "}
          {date}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;