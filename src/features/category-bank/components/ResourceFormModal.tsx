import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import PopuupLayout from "@/components/layouts/Popup-layout";
import { useBankCategories } from "../api/quertes";

interface ResourceFormModalProps {
  openButton: React.ReactNode;
  initialValues?: { name: string; description: string; categoryId: number };
  onConfirm: (data: { name: string; description: string; categoryId: number }) => void;
}

export function ResourceFormModal({
  openButton,
  initialValues,
  onConfirm,
}: ResourceFormModalProps) {
  const { t } = useTranslation();
  const isUpdate = !!initialValues;
  const { data: categoriesData } = useBankCategories();
  const categories = categoriesData?.categories ?? [];

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? 0);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setCategoryId(initialValues.categoryId);
    }
  }, [initialValues]);

  const handleSubmit = (closeModal: () => void) => {
    if (!name.trim() || !description.trim() || !categoryId) return;
    onConfirm({ name: name.trim(), description: description.trim(), categoryId });
    closeModal();
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-resource-modal" : "create-resource-modal"}
      title={t(
        isUpdate ? "categoryBank.editModal.title" : "categoryBank.addModal.title",
        { defaultValue: isUpdate ? "Edit Resource" : "Create Resource" },
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="res-name">
              {t("categoryBank.systemResources.table.name", "Name")}
            </Label>
            <Input
              id="res-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Steel Beam"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="res-desc">
              {t("categoryBank.detailsModal.description", "Description")}
            </Label>
            <Input
              id="res-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>
              {t("categoryBank.systemResources.table.category", "Category")}
            </Label>
            <Select
              value={categoryId ? String(categoryId) : ""}
              onValueChange={(v) => setCategoryId(Number(v))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("categoryBank.systemResources.filterByCategory", "Select category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="default"
              disabled={!name.trim() || !description.trim() || !categoryId}
              onClick={() => handleSubmit(closeModal)}
            >
              {t(
                isUpdate ? "categoryBank.editModal.actions.confirm" : "categoryBank.addModal.actions.confirm",
                { defaultValue: isUpdate ? "Update" : "Create" },
              )}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
