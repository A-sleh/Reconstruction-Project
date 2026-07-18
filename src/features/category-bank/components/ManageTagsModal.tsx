import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { SystemCategory } from "../mock/categories";

interface ManageTagsModalProps {
  category: SystemCategory | null;
  openButton: React.ReactNode;
  onConfirm: (categoryId: number, tags: string[]) => void;
}

export function ManageTagsModal({
  category,
  openButton,
  onConfirm,
}: ManageTagsModalProps) {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>(category?.tags || []);
  const [newTag, setNewTag] = useState("");
  const OPEN_KEY = "manage-tags-" + category?.id;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleConfirm = () => {
    if (category) {
      onConfirm(category.id, tags);
    }
  };

  if (!category) return null;

  return (
    <PopuupLayout
      openKey={OPEN_KEY}
      title={t("categoryBank.tagsModal.title", { defaultValue: "Manage Tags" })}
      subTitle={category.name}
      openButton={openButton}
    >
      <div className="space-y-4 my-4">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t("categoryBank.tagsModal.placeholder", {
              defaultValue: "Enter new tag...",
            })}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddTag}
            disabled={!newTag.trim() || tags.includes(newTag.trim())}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("categoryBank.tagsModal.noTags", { defaultValue: "No tags added yet." })}
            </p>
          ) : (
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary/70 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="default" onClick={handleConfirm}>
          {t("categoryBank.tagsModal.actions.confirm", { defaultValue: "Save Tags" })}
        </Button>
      </div>
    </PopuupLayout>
  );
}
