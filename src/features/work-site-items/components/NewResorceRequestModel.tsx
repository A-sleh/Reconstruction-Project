import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { X } from "lucide-react";
import { useAddBankItemRequest } from "@/features/category-bank/api/actions";
import { useBankCategories } from "@/features/category-bank/api/quertes";
import { successToast, errorToast } from "@/components/common/Toast";
import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";
import useAuthStore, { User } from "@/stores/useAuthStore";

export function getRolePrefix(role: string) {
  return role === "Service" ? "workSiteItems.serviceProvidor" : "workSiteItems.resourceProvidor";
}

interface NewResorceRequestModelProps {
  openButton: React.ReactNode;
}

export function NewResorceRequestModel({
  openButton,
}: NewResorceRequestModelProps) {
  const { t } = useTranslation();
  const providerRole = useAuthStore((s) => (s.user as User)?.providerRole) ?? "Resource";
  const rolePrefix = getRolePrefix(providerRole);
  const { mutate: addRequest, isPending } = useAddBankItemRequest();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useBankCategories();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [note, setNote] = useState("");

  const categories = categoriesData?.categories ?? [];
  const isValid = itemName.trim() && categoryId !== "";

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
            t(`${rolePrefix}.requestModal.success`),
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
              t(`${rolePrefix}.requestModal.error`),
          );
        },
      },
    );
  };

  return (
    <Model>
      <Model.Open opens="new-resource-request">{openButton}</Model.Open>
      <Model.Window name="new-resource-request">
        <div className="p-1">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t(`${rolePrefix}.requestModal.title`)}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {t(`${rolePrefix}.requestModal.description`)}
              </p>
            </div>
            <Model.Close>
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                ref={closeBtnRef}
              >
                <X className="h-4 w-4" />
              </button>
            </Model.Close>
          </div>

          <div className="space-y-4">
            {/* Item Name */}
            <div className="space-y-1.5">
              <Input
                label={t(`${rolePrefix}.requestModal.item_name`)}
                id="item-name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={t(`${rolePrefix}.requestModal.item_name_placeholder`)}
                className="border-gray-200"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="item-description"
                className="text-sm font-medium text-gray-700"
              >
                {t(`${rolePrefix}.requestModal.item_description`)}
              </Label>
              <Textarea
                id="item-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(`${rolePrefix}.requestModal.item_description_placeholder`)}
                rows={3}
                className="border-gray-200 resize-none"
              />
            </div>

            {/* Category */}
            <Selector
              label={t(`${rolePrefix}.requestModal.category`)}
              value={categoryId}
              setValue={(value) => setCategoryId(value ? Number(value) : "")}
            >
              <option value="">
                {t(`${rolePrefix}.requestModal.category_placeholder`)}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Selector>

            {/* Note */}
            <div className="space-y-1.5">
              <Label
                htmlFor="note"
                className="text-sm font-medium text-gray-700"
              >
                {t(`${rolePrefix}.requestModal.note`)}
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t(`${rolePrefix}.requestModal.note_placeholder`)}
                rows={2}
                className="border-gray-200 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
            <Model.Close>
              <Button
                type="button"
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                {t("workSites.btn-cancel")}
              </Button>
            </Model.Close>
            <Button
              type="button"
              disabled={!isValid || isPending}
              isLoading={isPending}
              onClick={handleSubmit}
              className="bg-primary text-white hover:opacity-90"
            >
              {t(`${rolePrefix}.requestModal.submit`)}
            </Button>
          </div>
        </div>
      </Model.Window>
    </Model>
  );
}
