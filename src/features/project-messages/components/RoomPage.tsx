import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProjectMessage } from "../api/types";
import {
  MOCK_CHAT_MESSAGES,
  MOCK_CHAT_PARTICIPANTS,
} from "../mock/messages";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import ParticipantList from "./ParticipantList";
import RoomHeader from "./RoomHeader";

const CURRENT_USER_ID = "p1";

const RoomPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const [messages, setMessages] = useState<ProjectMessage[]>(MOCK_CHAT_MESSAGES);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${crypto.randomUUID()}`,
        text,
        senderId: CURRENT_USER_ID,
        timestamp: new Date().toISOString(),
        type: "message",
      },
    ]);
  };

  return (
    <div className="space-y-5" dir={dir}>
      <RoomHeader memberCount={MOCK_CHAT_PARTICIPANTS.length} />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-[60vh] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-card lg:order-1">
          <MessageList
            messages={messages}
            participants={MOCK_CHAT_PARTICIPANTS}
            currentUserId={CURRENT_USER_ID}
          />
          <MessageComposer onSend={handleSend} />
        </div>

        <div className="lg:order-2">
          <ParticipantList
            participants={MOCK_CHAT_PARTICIPANTS}
            currentUserId={CURRENT_USER_ID}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;