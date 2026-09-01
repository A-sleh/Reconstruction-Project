import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  senderName?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello, I need help with my order",
    sender: "other",
    timestamp: "10:30 AM",
    senderName: "Ahmed",
  },
  {
    id: "2",
    text: "Sure! Can you provide your order number?",
    sender: "me",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    text: "It's #ORD-2024-1234",
    sender: "other",
    timestamp: "10:32 AM",
    senderName: "Ahmed",
  },
  {
    id: "4",
    text: "I found your order. It's currently being processed and will ship within 24 hours.",
    sender: "me",
    timestamp: "10:33 AM",
  },
  {
    id: "5",
    text: "Great, thank you for the quick response!",
    sender: "other",
    timestamp: "10:34 AM",
    senderName: "Ahmed",
  },
];

const ChatMessages = ({ messages = mockMessages }: Partial<ChatMessagesProps>) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-3 max-h-120 bg-white">
        <p className="text-sm text-muted-foreground">
          {t("support.chatMessages.noMessages")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 max-h-120 bg-white">
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div className="max-w-[75%]">
              {message.sender === "other" && message.senderName && (
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {message.senderName}
                </p>
              )}
              <div
                className={cn(
                  "rounded-tl-lg rounded-tr-lg px-3 py-2",
                  message.sender === "me"
                    ? "rounded-br-lg bg-primary text-primary-foreground"
                    : "rounded-bl-lg bg-muted text-foreground"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <p
                className={cn(
                  "text-[10px] mt-1 opacity-70 text-muted-foreground",
                  message.sender === "me" ? "text-right" : "text-left"
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
