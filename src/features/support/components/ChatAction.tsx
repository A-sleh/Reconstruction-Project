import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "./EmojiPicker";

interface ChatActionProps {
  onSend: (message: string) => void;
}

const ChatAction = ({ onSend }: ChatActionProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card border-t border-border">
      <EmojiPicker onEmojiSelect={handleEmojiSelect}  />
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("support.chatAction.messagePlaceholder", "Type a message...")}
        className="flex-1"
      />
      <Button
        variant="default"
        size="icon"
        onClick={handleSend}
        disabled={!message.trim()}
        data-icon="inline-start"
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatAction;
