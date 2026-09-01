import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";
import { successToast } from "@/components/common/Toast";
import type { BoardMember, BoardPriority, TodoCard } from "../api/types";

interface FormValues {
  title: string;
  description: string;
  priority: BoardPriority;
  assignee: string;
  dueDate: string;
  tags: string;
}

const buildSchema = () =>
  z.object({
    title: z
      .string()
      .min(
        2,
        i18n.t("projectBoard.card.titlePlaceholder", {
          defaultValue: "Title must be at least 2 characters",
        }),
      ),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    assignee: z.string().optional(),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
  });

interface Props {
  members: BoardMember[];
  onSave: (card: TodoCard, columnId?: string) => void;
  card?: TodoCard | null;
  columnId?: string;
  openButton?: React.ReactNode;
  triggerLabel?: string;
}

const BoardCardModal = ({
  members,
  onSave,
  card,
  columnId,
  openButton,
  triggerLabel,
}: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema()) as unknown as Resolver<FormValues>,
    mode: "onSubmit",
    values: {
      title: card?.title ?? "",
      description: card?.description ?? "",
      priority: card?.priority ?? "medium",
      assignee: card?.assignee?.id ?? "",
      dueDate: card?.dueDate ?? "",
      tags: card?.tags?.join(", ") ?? "",
    },
  });

  const priority = watch("priority");
  const assignee = watch("assignee");

  const handleSave = (data: FormValues, close: () => void) => {
    const completed: TodoCard = {
      id: card?.id ?? crypto.randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      tags:
        data.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) || [],
      assignee: members.find((m) => m.id === data.assignee) ?? null,
      dueDate: data.dueDate || null,
    };
    onSave(completed, columnId);
    const isEdit = Boolean(card);
    successToast(
      isEdit
        ? i18n.t("projectBoard.toast.update", "Card updated successfully")
        : i18n.t("projectBoard.toast.create", "Card created successfully"),
    );
    reset();
    close();
  };

  const defaultButton = (
    <Button variant="default" size="sm">
      <Plus className="h-4 w-4" />
      {triggerLabel ?? t("projectBoard.addCard")}
    </Button>
  );

  return (
    <PopuupLayout
      openKey={card ? `edit-${card.id}` : "new-card"}
      title={t("projectBoard.dialogTitle")}
      subTitle={t("projectBoard.dialogSubtitle")}
      openButton={openButton ?? defaultButton}
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleSave(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <Input
            label={t("projectBoard.card.title")}
            placeholder={t("projectBoard.card.titlePlaceholder")}
            required
            fieldName="title"
            errors={errors}
            {...register("title")}
          />

          <Textarea
            label={t("projectBoard.card.description")}
            placeholder={t("projectBoard.card.descriptionPlaceholder")}
            rows={3}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />

          <div className="flex flex-col gap-3 md:flex-row">
            <Selector
              label={t("projectBoard.card.priority")}
              value={priority}
              setValue={(v) => setValue("priority", v as BoardPriority)}
              fieldName="priority"
              errors={errors}
            >
              <option value="low">
                {t("projectBoard.priority.low", "Low")}
              </option>
              <option value="medium">
                {t("projectBoard.priority.medium", "Medium")}
              </option>
              <option value="high">
                {t("projectBoard.priority.high", "High")}
              </option>
              <option value="urgent">
                {t("projectBoard.priority.urgent", "Urgent")}
              </option>
            </Selector>

            <Selector
              label={t("projectBoard.card.assignee")}
              value={assignee}
              setValue={(v) => setValue("assignee", v as string)}
              fieldName="assignee"
              errors={errors}
            >
              <option value="">
                {t("projectBoard.card.assigneePlaceholder", "Unassigned")}
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Selector>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="date"
              label={t("projectBoard.card.dueDate")}
              fieldName="dueDate"
              errors={errors}
              {...register("dueDate")}
            />
            <Input
              label={t("projectBoard.card.tags")}
              placeholder={t("projectBoard.card.tagsPlaceholder")}
              fieldName="tags"
              errors={errors}
              {...register("tags")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("projectBoard.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {t("projectBoard.card.confirm", "Save Card")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default BoardCardModal;
