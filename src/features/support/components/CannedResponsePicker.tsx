import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CannedOption {
  id: string;
  title: string;
  content: string;
}

interface CannedResponsePickerProps {
  options: CannedOption[];
  value: string;
  onSelect: (content: string, id: string) => void;
  disabled?: boolean;
}

const CannedResponsePicker = ({
  options,
  value,
  onSelect,
  disabled = false,
}: CannedResponsePickerProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] font-bold text-muted-foreground">
        {t("support.agent.workspace.cannedResponses", "Canned responses:")}
      </label>
      <Select
        value={value}
        onValueChange={(val) => {
          const opt = options.find((o) => o.id === val);
          if (opt) onSelect(opt.content, opt.id);
        }}
        disabled={disabled}
      >
        <SelectTrigger dir={isArabic ? "rtl" : "ltr"} className="min-w-52">
          <SelectValue
            placeholder={t(
              "support.agent.workspace.cannedPlaceholder",
              "Choose a saved response...",
            )}
          />
        </SelectTrigger>
        <SelectContent dir={isArabic ? "rtl" : "ltr"}>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CannedResponsePicker;
