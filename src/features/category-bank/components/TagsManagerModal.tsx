import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Tag, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddResourceTags,
  useAddServiceTags,
  useRemoveResourceTags,
  useRemoveServiceTags,
} from "../api/actions";
import TagSearchInput from "./TagSearchInput";

interface TagsManagerModalProps {
  type: "resource" | "service";
  itemId: number;
  itemName: string;
  initialTags: string[];
  openButton: React.ReactNode;
}

export function TagsManagerModal({
  type,
  itemId,
  itemName,
  initialTags,
  openButton,
}: TagsManagerModalProps) {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>(initialTags);

  const { mutate: addResourceTags } = useAddResourceTags();
  const { mutate: addServiceTags } = useAddServiceTags();
  const { mutate: removeResourceTags } = useRemoveResourceTags();
  const { mutate: removeServiceTags } = useRemoveServiceTags();

  const addTags: any = type === "resource" ? addResourceTags : addServiceTags;
  const removeTags: any =
    type === "resource" ? removeResourceTags : removeServiceTags;

  const handleSave = (closeModal: () => void) => {
    const originalIds = initialTags.map((t) => t);
    const currentIds = tags.map((t) => t);

    const toAdd = tags.filter((t) => !originalIds.includes(t));
    const toRemove = initialTags.filter((t) => !currentIds.includes(t));

    if (toAdd.length > 0) {
      addTags(
        type === "resource"
          ? {
              resourceBankId: itemId,
              tags: toAdd.map((t) => ({ name: t })),
            }
          : {
              serviceBankId: itemId,
              tags: toAdd.map((t) => ({ name: t })),
            },
      );
    }

    if (toRemove.length > 0) {
      removeTags(
        type === "resource"
          ? {
              resourceBankId: itemId,
              tags: toRemove.map((t) => ({ name: t })),
            }
          : {
              serviceBankId: itemId,
              tags: toRemove.map((t) => ({ name: t })),
            },
      );
    }

    setTags([]);
    closeModal();
  };

  const OPEN_KEY = `manage-tags-${type}-${itemId}`;

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.tagsModal.title", "Manage Tags")}
      subTitle={itemName}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {t("categoryBank.tagsModal.addNew", "Add or search tags")}
            </p>
            <TagSearchInput
              type={type}
              selectedTags={tags}
              onTagsChange={setTags}
            />
          </div>

          {tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("categoryBank.detailsModal.tags", "Tags")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() =>
                        setTags(tags.filter((t) => t.id !== tag.id))
                      }
                      className="hover:text-primary/70 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="default" onClick={() => handleSave(closeModal)}>
              {t("categoryBank.tagsModal.actions.confirm", "Save Tags")}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
