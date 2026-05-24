import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface ConfrimChangesProps {
  handleDiscard: () => void;
  handleSave: () => void;
  isSaving: boolean;
}

const ConfrimChanges: React.FC<ConfrimChangesProps> = ({
  handleDiscard,
  handleSave,
  isSaving,
}) => {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border border-warning/50 bg-white p-2 animate-in fade-in slide-in-from-bottom-2 duration-200 fixed bottom-4  z-50 ${
        isArabic ? "right-4 left-auto" : "right-auto left-4"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <p className="text-sm text-warning font-medium">
        {t(`common.banner.message`)}
      </p>
      <div className="flex items-center gap-2" dir={isArabic ? "rtl" : "ltr"}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDiscard}
          disabled={isSaving}
          className="text-muted-foreground hover:bg-background/50"
        >
          {t(`common.banner.cancel`)}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-warning text-white hover:bg-warning/90 min-w-[90px]"
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            t(`common.banner.save`)
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfrimChanges;
