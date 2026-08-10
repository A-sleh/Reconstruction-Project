import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";
import { Textarea } from "@/components/ui/textarea";
import type { ReactNode } from "react";
import type {
  EngineerProject,
  EngineerProjectStatus,
} from "../api/types";

const projectSchema = z.object({
  title: z
    .string()
    .min(3, i18n.t("engineerProfile.projects.validation.title")),
  category: z
    .string()
    .min(2, i18n.t("engineerProfile.projects.validation.category")),
  client: z
    .string()
    .min(2, i18n.t("engineerProfile.projects.validation.client")),
  location: z
    .string()
    .min(2, i18n.t("engineerProfile.projects.validation.location")),
  budget: z.coerce
    .number()
    .min(1, i18n.t("engineerProfile.projects.validation.budget")),
  startDate: z
    .string()
    .min(1, i18n.t("engineerProfile.projects.validation.startDate")),
  status: z.string().min(1, i18n.t("engineerProfile.projects.validation.status")),
  description: z
    .string()
    .min(10, i18n.t("engineerProfile.projects.validation.description")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const defaultValues: ProjectFormValues = {
  title: "",
  category: "",
  client: "",
  location: "",
  budget: 0,
  startDate: "",
  status: "IN_PROGRESS",
  description: "",
};

const statusOptions: EngineerProjectStatus[] = [
  "COMPLETED",
  "IN_PROGRESS",
  "PLANNING",
];

interface Props {
  onAdd: (project: EngineerProject) => void;
  openButton?: ReactNode;
}

const NewProjectModel = ({ onAdd, openButton }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as unknown as Resolver<ProjectFormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const status = watch("status");

  const handleCreate = (data: ProjectFormValues, close: () => void) => {
    onAdd({
      id: crypto.randomUUID(),
      title: data.title,
      category: data.category,
      client: data.client,
      location: data.location,
      budget: data.budget,
      status: data.status,
      startDate: data.startDate,
      endDate: null,
      description: data.description,
      imageUrl: null,
      createdAt: new Date().toISOString(),
    });
    reset(defaultValues);
    close();
  };

  return (
    <PopuupLayout
      openKey="new-engineer-project"
      title={t("engineerProfile.projects.model.title")}
      subTitle={t("engineerProfile.projects.model.subtitle")}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("engineerProfile.projects.lastProjects.newProject")}
          </Button>
        )
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleCreate(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.projects.fields.title")}
              placeholder={t("engineerProfile.projects.placeholders.title")}
              required={true}
              fieldName="title"
              errors={errors}
              {...register("title")}
            />
            <Input
              label={t("engineerProfile.projects.fields.category")}
              placeholder={t("engineerProfile.projects.placeholders.category")}
              fieldName="category"
              errors={errors}
              {...register("category")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.projects.fields.client")}
              placeholder={t("engineerProfile.projects.placeholders.client")}
              fieldName="client"
              errors={errors}
              {...register("client")}
            />
            <Input
              label={t("engineerProfile.projects.fields.location")}
              placeholder={t("engineerProfile.projects.placeholders.location")}
              fieldName="location"
              errors={errors}
              {...register("location")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="number"
              min={0}
              step="0.01"
              label={t("engineerProfile.projects.fields.budget")}
              placeholder={t("engineerProfile.projects.placeholders.budget")}
              fieldName="budget"
              errors={errors}
              {...register("budget")}
            />
            <Input
              type="date"
              label={t("engineerProfile.projects.fields.startDate")}
              required={true}
              fieldName="startDate"
              errors={errors}
              {...register("startDate")}
            />
            <Selector
              label={t("engineerProfile.projects.fields.status")}
              required={true}
              fieldName="status"
              errors={errors}
              value={status}
              setValue={(value) => setValue("status", value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`engineerProfile.projects.status.${option}`)}
                </option>
              ))}
            </Selector>
          </div>

          <Textarea
            label={t("engineerProfile.projects.fields.description")}
            placeholder={t("engineerProfile.projects.placeholders.description")}
            rows={4}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.projects.model.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {t("engineerProfile.projects.model.submit")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default NewProjectModel;
