import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BankItemType, CategoryPayload } from "../api/types";

interface CategoryFormModalProps {
  openButton: React.ReactNode;
  initialName?: string;
  onConfirm: (payload: Omit<CategoryPayload, "id">) => void;
}

export function CategoryFormModal({
  openButton,
  initialName = "",
  onConfirm,
}: CategoryFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [categoryType, setCategoryType] = useState<BankItemType>("Resource");
  const isUpdate = initialName !== "";

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (closeModal: () => void) => {
    if (!name.trim()) return;
    onConfirm({ name: name.trim(), categoryType });
    closeModal();
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-category-modal" : "add-category-modal"}
      title={t(
        isUpdate
          ? "categoryBank.editModal.title"
          : "categoryBank.addModal.title",
        { defaultValue: isUpdate ? "Edit Category" : "Add New Category" },
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="cat-name">
              {t("categoryBank.addModal.nameLabel", {
                defaultValue: "Category Name",
              })}
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

          <div>
            <Label htmlFor="cat-type">
              {t("categoryBank.addModal.typeLabel", { defaultValue: "Type" })}
            </Label>
            <Select
              value={categoryType}
              onValueChange={(value) =>
                setCategoryType(value as CategoryPayload["categoryType"])
              }
              dir="rtl"
            >
              <SelectTrigger id="cat-type" className="w-full mt-1 z-100">
                <SelectValue
                  placeholder={t("categoryBank.addModal.typeLabel", {
                    defaultValue: "Type",
                  })}
                />
              </SelectTrigger>
              <SelectContent className="z-100">
                <SelectItem value="Resource">
                  {t("categoryBank.table.resource", {
                    defaultValue: "Resource",
                  })}
                </SelectItem>
                <SelectItem value="Service">
                  {t("categoryBank.table.service", { defaultValue: "Service" })}
                </SelectItem>
              </SelectContent>
            </Select>
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
