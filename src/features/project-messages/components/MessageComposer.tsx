import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { successToast } from "@/components/common/Toast";
import i18n from "@/lib/i18n";

interface Props {
  onSend: (text: string) => void;
}

const MessageComposer = ({ onSend }: Props) => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setContent("");
    successToast(i18n.t("projectMessages.toast.sent", "Message sent"));
  };

  return (
    <div className="flex items-end gap-2 border-t border-gray-200 bg-white p-3">
      <Textarea
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={t("projectMessages.composerPlaceholder")}
        className="min-h-10 flex-1 resize-none"
        fieldName=""
      />
      <Button
        variant="default"
        size="icon"
        disabled={!content.trim()}
        onClick={handleSend}
        aria-label={t("projectMessages.send")}
      >
        <Send className="h-4 w-4 rotate-180" />
      </Button>
    </div>
  );
};

export default MessageComposer;