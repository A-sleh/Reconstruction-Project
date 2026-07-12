import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddBankItemRequest } from "@/features/category-bank/api/actions";
import { useBankCategories } from "../api/queries";
import { successToast, errorToast } from "@/components/common/Toast";
import { NewResorceRequestModelPresentation } from "./NewResorceRequestModelPresentation";

interface NewResorceRequestModelProps {
  openButton: React.ReactNode;
}

export function NewResorceRequestModel({
  openButton,
}: NewResorceRequestModelProps) {
  const { t } = useTranslation();
  const { mutate: addRequest, isPending } = useAddBankItemRequest();
  const { data: categoriesData, isLoading: categoriesLoading } =
useBankCategories();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [note, setNote] = useState("");

  const categories = categoriesData?.categories ?? [];
  const isValid = itemName.trim() != "" && categoryId !== "";

  const handleSubmit = () => {
    if (!isValid) return;

    addRequest(
      {
        itemName: itemName.trim(),
        description: description.trim(),
        note: note.trim(),
        categoryId: Number(categoryId),
      },
      {
        onSuccess: () => {
          successToast(
            t("resourceProvidor.workSites.orders.request-modal.success"),
          );
          setItemName("");
          setDescription("");
          setCategoryId("");
          setNote("");
          closeBtnRef.current?.click();
        },
        onError: (error: any) => {
          const serverMessage =
            error?.response?.data?.message || error?.message;
          errorToast(
            serverMessage ||
              t("resourceProvidor.workSites.orders.request-modal.error"),
          );
        },
      },
    );
  };

  return (
    <NewResorceRequestModelPresentation
      openButton={openButton}
      closeBtnRef={closeBtnRef}
      itemName={itemName}
      description={description}
      categoryId={categoryId}
      note={note}
      categories={categories}
      categoriesLoading={categoriesLoading}
      isPending={isPending}
      isValid={isValid}
      onItemNameChange={setItemName}
      onDescriptionChange={setDescription}
      onCategoryIdChange={setCategoryId}
      onNoteChange={setNote}
      onSubmit={handleSubmit}
    />
  );
}
