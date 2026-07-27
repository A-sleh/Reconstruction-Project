import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopuupLayout from "@/components/layouts/Popup-layout";
import AttachmentList, { type AttachmentListHandle } from "@/features/attachment/components/AttachmentList";
import type { Attachment } from "../api/types";

interface AddAttachmentPopupProps {
  initialItems: Attachment[];
  onSave: (items: Attachment[], closePopup: () => void) => void;
  isSaving?: boolean;
}

export default function AddAttachmentPopup({
  initialItems,
  onSave,
  isSaving = false,
}: AddAttachmentPopupProps) {
  const { t } = useTranslation();
  const attachmentListRef = useRef<AttachmentListHandle>(null);

  return (
    <PopuupLayout
      openKey="add-land-attachment"
      title={t("investor.addAttachment")}
      openButton={
        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      }
    >
      {(closePopup) => (
        <div className="space-y-4">
          <AttachmentList
            ref={attachmentListRef}
            mode="self-contained"
            initialItems={initialItems}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closePopup()}
            >
              {t("investor.btn-cancel")}
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => {
                const items: Attachment[] = attachmentListRef.current?.getValues() ?? [];
                onSave(items, closePopup);
              }}
            >
              {isSaving
                ? t("common.loading", "Saving...")
                : t("investor.btn-save")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
