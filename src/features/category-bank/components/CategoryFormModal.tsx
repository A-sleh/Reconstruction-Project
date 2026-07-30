import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import PopuupLayout from "@/components/layouts/Popup-layout";

interface CategoryFormModalProps {
  openButton: React.ReactNode;
  initialName?: string;
  onConfirm: (name: string) => void;
}

export function CategoryFormModal({
  openButton,
  initialName = "",
  onConfirm,
}: CategoryFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const isUpdate = initialName !== "";

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (closeModal: () => void) => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    closeModal();
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-category-modal" : "add-category-modal"}
      title={t(
        isUpdate ? "categoryBank.editModal.title" : "categoryBank.addModal.title",
        { defaultValue: isUpdate ? "Edit Category" : "Add New Category" },
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="cat-name">
              {t("categoryBank.addModal.nameLabel", { defaultValue: "Category Name" })}
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("categoryBank.addModal.namePlaceholder", {
                defaultValue: "Enter category name...",
              })}
              className="mt-1"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="default"
              disabled={!name.trim()}
              onClick={() => handleSubmit(closeModal)}
            >
              {t(
                isUpdate
                  ? "categoryBank.editModal.actions.confirm"
                  : "categoryBank.addModal.actions.confirm",
                { defaultValue: isUpdate ? "Update Category" : "Add Category" },
              )}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
