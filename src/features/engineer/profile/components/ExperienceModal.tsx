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
import { Textarea } from "@/components/ui/textarea";
import type { ReactNode } from "react";
import type { EngineerExperience } from "../api/types";

const experienceSchema = z
  .object({
    jobTitle: z
      .string()
      .min(3, i18n.t("engineerProfile.experience.validation.jobTitle")),
    company: z
      .string()
      .min(2, i18n.t("engineerProfile.experience.validation.company")),
    location: z
      .string()
      .min(2, i18n.t("engineerProfile.experience.validation.location")),
    startDate: z
      .string()
      .min(1, i18n.t("engineerProfile.experience.validation.startDate")),
    isCurrent: z.boolean().default(false),
    endDate: z.string().optional(),
    description: z
      .string()
      .min(10, i18n.t("engineerProfile.experience.validation.description")),
  })
  .superRefine((val, ctx) => {
    if (!val.isCurrent && !val.endDate) {
      ctx.addIssue({
        code: "custom",
        message: i18n.t("engineerProfile.experience.validation.endDate"),
        path: ["endDate"],
      });
    }
  });

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const defaultValues: ExperienceFormValues = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

interface Props {
  onAdd: (experience: EngineerExperience) => void;
  openButton?: ReactNode;
}

const ExperienceModal = ({ onAdd, openButton }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema) as unknown as Resolver<ExperienceFormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const isCurrent = watch("isCurrent");

  const handleCreate = (data: ExperienceFormValues, close: () => void) => {
    onAdd({
      id: crypto.randomUUID(),
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location,
      startDate: data.startDate,
      endDate: data.isCurrent ? null : data.endDate || null,
      description: data.description,
      isCurrent: data.isCurrent,
    });
    reset(defaultValues);
    close();
  };

  return (
    <PopuupLayout
      openKey="engineer-experience"
      title={t("engineerProfile.experience.model.title")}
      subTitle={t("engineerProfile.experience.model.subtitle")}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("engineerProfile.experience.add")}
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
              label={t("engineerProfile.experience.fields.jobTitle")}
              placeholder={t("engineerProfile.experience.placeholders.jobTitle")}
              required={true}
              fieldName="jobTitle"
              errors={errors}
              {...register("jobTitle")}
            />
            <Input
              label={t("engineerProfile.experience.fields.company")}
              placeholder={t("engineerProfile.experience.placeholders.company")}
              required={true}
              fieldName="company"
              errors={errors}
              {...register("company")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.experience.fields.location")}
              placeholder={t("engineerProfile.experience.placeholders.location")}
              required={true}
              fieldName="location"
              errors={errors}
              {...register("location")}
            />
            <Input
              type="date"
              label={t("engineerProfile.experience.fields.startDate")}
              required={true}
              fieldName="startDate"
              errors={errors}
              {...register("startDate")}
            />
            <Input
              type="date"
              label={t("engineerProfile.experience.fields.endDate")}
              fieldName="endDate"
              errors={errors}
              disabled={isCurrent}
              {...register("endDate")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              {...register("isCurrent")}
            />
            {t("engineerProfile.experience.fields.isCurrent")}
          </label>

          <Textarea
            label={t("engineerProfile.experience.fields.description")}
            placeholder={t("engineerProfile.experience.placeholders.description")}
            rows={4}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.experience.model.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {t("engineerProfile.experience.model.submit")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default ExperienceModal;
