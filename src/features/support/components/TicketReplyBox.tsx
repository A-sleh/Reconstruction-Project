import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { Lock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { successToast } from "@/components/common/Toast";
import { mockCannedResponses } from "../mock";

type ReplyMode = "reply" | "internal";

interface TicketReplyBoxProps {
  ticketId: string;
  onSend?: () => void;
}

const TicketReplyBox = ({ onSend }: TicketReplyBoxProps) => {
  const { t, i18n: i18nHook } = useTranslation();
  const isArabic = i18nHook.language === "ar";
  const [mode, setMode] = useState<ReplyMode>("reply");
  const [content, setContent] = useState("");
  const [selectedCanned, setSelectedCanned] = useState("");

  const cannedResponses = mockCannedResponses;

  const handleSelectCanned = (value: string) => {
    setSelectedCanned(value);
    const response = cannedResponses.find((canned) => canned.id === value);
    if (response) setContent(response.content);
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    successToast(
      i18n.t("support.agent.messageSent", "Message sent successfully"),
    );
    setContent("");
    setSelectedCanned("");
    onSend?.();
  };

  return (
    <div className="p-4 bg-white border-t border-border space-y-3 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "reply" ? "default" : "outline"}
            onClick={() => setMode("reply")}
          >
            {t("support.agent.workspace.replyToCustomer", "Reply to customer")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode("internal")}
            className={cn(
              mode === "internal" &&
                "bg-amber-100 text-amber-800 border-amber-200",
            )}
          >
            <Lock />
            {t("support.agent.workspace.addInternalNote", "Add internal note")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-muted-foreground">
            {t("support.agent.workspace.cannedResponses", "Canned responses:")}
          </label>
          <Select value={selectedCanned} onValueChange={handleSelectCanned}>
            <SelectTrigger dir={isArabic ? "rtl" : "ltr"} className="min-w-52">
              <SelectValue
                placeholder={t(
                  "support.agent.workspace.cannedPlaceholder",
                  "Choose a saved response...",
                )}
              />
            </SelectTrigger>
            <SelectContent dir={isArabic ? "rtl" : "ltr"}>
              {cannedResponses.map((canned) => (
                <SelectItem key={canned.id} value={canned.id}>
                  {canned.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t(
          mode === "reply"
            ? "support.agent.workspace.replyPlaceholder"
            : "support.agent.workspace.internalPlaceholder",
          mode === "reply"
            ? "Type your reply to the customer here..."
            : "Type an internal note (hidden from customer)...",
        )}
      />

      <div className="flex justify-end">
        <Button
          variant="default"
          disabled={!content.trim()}
          onClick={handleSend}
        >
          <Send />
          {t("support.agent.workspace.send", "Send Reply")}
        </Button>
      </div>
    </div>
  );
};

export default TicketReplyBox;
