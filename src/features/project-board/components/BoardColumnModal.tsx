import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import { successToast } from "@/components/common/Toast";

interface FormValues {
  title: string;
}

const buildSchema = () =>
  z.object({
    title: z
      .string()
      .min(
        2,
        i18n.t("projectBoard.columnPlaceholder", {
          defaultValue: "Column name must be at least 2 characters",
        }),
      ),
  });

interface Props {
  onSave: (title: string, columnId?: string) => void;
  column?: { id: string; title: string } | null;
  mode: "create" | "edit";
  openButton?: React.ReactNode;
}

const BoardColumnModal = ({ onSave, column, mode, openButton }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema()) as unknown as Resolver<FormValues>,
    mode: "onSubmit",
    values: { title: column?.title ?? "" },
  });

  const handleSave = (data: FormValues, close: () => void) => {
    onSave(data.title.trim(), column?.id);
    successToastLocal(mode);
    reset();
    close();
  };

  const defaultButton =
    mode === "create" ? (
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4" />
        {t("projectBoard.addColumn")}
      </Button>
    ) : null;

  return (
    <PopuupLayout
      openKey={mode === "create" ? "new-column" : `edit-column-${column?.id}`}
      title={
        mode === "create"
          ? t("projectBoard.addColumn")
          : t("projectBoard.editColumn")
      }
      openButton={openButton ?? defaultButton}
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleSave(data, close))}
          className="space-y-5"
        >
          <Input
            label={t("projectBoard.titleColumn")}
            placeholder={t("projectBoard.columnPlaceholder")}
            required
            fieldName="title"
            errors={errors}
            {...register("title")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("projectBoard.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">{t("projectBoard.save", "Save")}</Button>
          </div>
        </form>
      )}
    />
  );
};

function successToastLocal(mode: "create" | "edit") {
  successToast(
    i18n.t(
      mode === "create"
        ? "projectBoard.toast.columnCreated"
        : "projectBoard.toast.columnUpdated",
      mode === "create" ? "Column created" : "Column renamed",
    ),
  );
}

export default BoardColumnModal;
