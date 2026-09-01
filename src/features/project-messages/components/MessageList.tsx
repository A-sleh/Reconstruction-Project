import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";
import type {
  ProjectChatParticipant,
  ProjectMessage,
} from "../api/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ProjectMessage[];
  participants: ProjectChatParticipant[];
  currentUserId: string;
}

const MessageList = ({ messages, participants, currentUserId }: Props) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-white px-4 py-10">
        <MessageSquare className="h-10 w-10 text-gray-300" />
        <p className="text-sm text-muted-foreground">
          {t("projectMessages.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-4" style={{ maxHeight: "60vh" }}>
      {messages.map((message) => {
        const sender = participants.find((p) => p.id === message.senderId);
        if (!sender) return null;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            sender={sender}
            isCurrentUser={message.senderId === currentUserId}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;