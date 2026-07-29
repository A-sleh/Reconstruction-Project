import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import PopuupLayout from "@/components/layouts/Popup-layout";

import { DynamicAsyncSelector } from "@/features/site-resources/components/SmartDataGrid";

interface ResolveRequestModalProps {
  requestId: number | null;
  openButton: React.ReactNode;
  onConfirm: (payload: {
    requestId: number;
    existingBankItemId: number;
    tagName: string;
  }) => void;
}

export function ResolveRequestModal({
  openButton,
  requestId,
  onConfirm,
}: ResolveRequestModalProps) {
  const { t } = useTranslation();
  const [tagName, setTagName] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const OPEN_KEY = "resolve-category-request" + requestId;

  const handleSubmit = () => {
    if (requestId && selectedItem && tagName.trim()) {
      onConfirm({
        requestId,
        existingBankItemId: selectedItem.id,
        tagName: tagName.trim(),
      });
      setTagName("");
      setSelectedItem(null);
    }
  };

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.resolveModal.title", {
        defaultValue: "Resolve Request",
      })}
      subTitle={t("categoryBank.resolveModal.description", {
        defaultValue:
          "Assign this request to an existing bank item and add a tag.",
      })}
      openButton={openButton}
    >
      <div className="space-y-4 my-4">
        {/* Tag Name Input */}
        <div className="space-y-2">
          <Input
            label={t("categoryBank.resolveModal.tagNameLabel", {
              defaultValue: "Tag Name",
            })}
            id="resolve-tag-name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder={t("categoryBank.resolveModal.tagNamePlaceholder", {
              defaultValue: "Enter tag name...",
            })}
          />
        </div>

        {/* Bank Item Selector */}
        <div className="space-y-2">
          <DynamicAsyncSelector
            value={selectedItem}
            onSelect={(item) => setSelectedItem(item)}
            placeholder={t("categoryBank.resolveModal.existingItemLabel", {
              defaultValue: "Existing Bank Item",
            })}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
        <Button
          variant="default"
          disabled={!selectedItem || !tagName.trim()}
          onClick={handleSubmit}
        >
          {t("categoryBank.resolveModal.actions.confirm", {
            defaultValue: "Resolve",
          })}
        </Button>
      </div>
    </PopuupLayout>
  );
}
