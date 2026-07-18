import { useState } from "react";
import EmojiPickerLib from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={t("support.emojiPicker.openPicker", "Open emoji picker")}
        >
          <Smile />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-fit p-0 border-border"
      >
        <EmojiPickerLib
          onEmojiClick={(emojiData) => {
            onEmojiSelect(emojiData.emoji);
            setIsOpen(false);
          }}
          theme={"light" as any}
          width={320}
          height={400}
          lazyLoadEmojis
          
          previewConfig={{ showPreview: false }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
