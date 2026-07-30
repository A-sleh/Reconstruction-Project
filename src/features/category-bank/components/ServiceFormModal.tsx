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

interface ServiceFormModalProps {
  openButton: React.ReactNode;
  initialValues?: { name: string; description: string; serviceTypeId: number };
  onConfirm: (data: { name: string; description: string; serviceTypeId: number }) => void;
}

export function ServiceFormModal({
  openButton,
  initialValues,
  onConfirm,
}: ServiceFormModalProps) {
  const { t } = useTranslation();
  const isUpdate = !!initialValues;
  const { data: categoriesData } = useBankCategories();
  const categories = categoriesData?.categories ?? [];

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [serviceTypeId, setServiceTypeId] = useState(initialValues?.serviceTypeId ?? 0);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setServiceTypeId(initialValues.serviceTypeId);
    }
  }, [initialValues]);

  const handleSubmit = (closeModal: () => void) => {
    if (!name.trim() || !description.trim() || !serviceTypeId) return;
    onConfirm({ name: name.trim(), description: description.trim(), serviceTypeId });
    closeModal();
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-service-modal" : "create-service-modal"}
      title={t(
        isUpdate ? "categoryBank.editModal.title" : "categoryBank.addModal.title",
        { defaultValue: isUpdate ? "Edit Service" : "Create Service" },
      )}
      openButton={openButton}
    >
      {(closeModal) => (
        <div className="space-y-4 my-4">
          <div>
            <Label htmlFor="svc-name">
              {t("categoryBank.systemServices.table.name", "Name")}
            </Label>
            <Input
              id="svc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Welding"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="svc-desc">
              {t("categoryBank.detailsModal.description", "Description")}
            </Label>
            <Input
              id="svc-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>
              {t("categoryBank.systemServices.table.category", "Category")}
            </Label>
            <Select
              value={serviceTypeId ? String(serviceTypeId) : ""}
              onValueChange={(v) => setServiceTypeId(Number(v))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("categoryBank.systemServices.filterByCategory", "Select category")} />
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
              disabled={!name.trim() || !description.trim() || !serviceTypeId}
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
