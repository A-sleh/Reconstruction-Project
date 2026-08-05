import PopuupLayout from "@/components/layouts/Popup-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryFilter from "./CategoryFilter";

interface ResourceFormModalProps {
  openButton: React.ReactNode;
  initialValues?: { name: string; description: string; categoryId: number };
  isLoading: boolean;
  onConfirm: (
    data: {
      name: string;
      description: string;
      categoryId: number;
    },
    close?: () => void,
  ) => void;
}

export function ResourceFormModal({
  openButton,
  initialValues,
  isLoading,
  onConfirm,
}: ResourceFormModalProps) {
  const { t } = useTranslation();
  const isUpdate = !!initialValues;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
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
    onConfirm(
      {
        name: name.trim(),
        description: description.trim(),
        categoryId,
      },
      closeModal,
    );
  };

  return (
    <PopuupLayout
      openKey={isUpdate ? "edit-resource-modal" : "create-resource-modal"}
      title={t(
        isUpdate
          ? "categoryBank.editModal.title"
          : "categoryBank.addModal.title",
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

          <Label>
            {t("categoryBank.systemResources.table.category", "Category")}
          </Label>
          <CategoryFilter
            bankType="Resource"
            onValueChange={(id: number | "all") => {
              console.log(id);
              if (id === "all") {
                setCategoryId(0);
              } else setCategoryId(id);
            }}
            value={Number(categoryId)}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="default"
              isLoading={isLoading}
              disabled={
                !name.trim() || !description.trim() || !categoryId || isLoading
              }
              onClick={() => handleSubmit(closeModal)}
            >
              {t(
                isUpdate
                  ? "categoryBank.editModal.actions.confirm"
                  : "categoryBank.addModal.actions.confirm",
                { defaultValue: isUpdate ? "Update" : "Create" },
              )}
            </Button>
          </div>
        </div>
      )}
    </PopuupLayout>
  );
}
