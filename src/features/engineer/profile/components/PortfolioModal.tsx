import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import z from "zod";

import i18n from "@/lib/i18n";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import Input from "@/components/inputs/Input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type {
  EngineerPortfolio,
  EngineerPortfolioAttachment,
} from "../api/engineer-profile";

const portfolioSchema = z.object({
  title: z
    .string()
    .min(3, i18n.t("engineerProfile.portfolio.validation.title")),
  description: z
    .string()
    .min(10, i18n.t("engineerProfile.portfolio.validation.description")),
  year: z.coerce
    .number()
    .min(1900, i18n.t("engineerProfile.portfolio.validation.year"))
    .max(2100, i18n.t("engineerProfile.portfolio.validation.year")),
  projectId: z.coerce.number().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface Props {
  portfolio?: EngineerPortfolio;
  onSave: (portfolio: EngineerPortfolio) => void;
}

const PortfolioModal = ({ portfolio, onSave }: Props) => {
  const { t } = useTranslation();
  const isEdit = Boolean(portfolio);

  const [attachments, setAttachments] = useState<EngineerPortfolioAttachment[]>(
    portfolio?.attachments ?? [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema) as unknown as Resolver<PortfolioFormValues>,
    mode: "onSubmit",
    defaultValues: {
      title: portfolio?.title ?? "",
      description: portfolio?.description ?? "",
      year: portfolio?.year ?? new Date().getFullYear(),
      projectId: portfolio?.projectId ?? undefined,
    },
  });

  const thumbnails = useMemo(
    () => attachments.filter((att) => !!att.url),
    [attachments],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          { id: crypto.randomUUID(), fileId: crypto.randomUUID(), url: String(reader.result), description: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = (data: PortfolioFormValues, close: () => void) => {
    onSave({
      id: portfolio?.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description,
      year: data.year,
      projectId: data.projectId ?? 0,
      attachments,
    });
    close();
  };

  return (
    <PopuupLayout
      openKey={portfolio ? `edit-portfolio-${portfolio.id}` : "add-portfolio"}
      title={
        isEdit
          ? t("engineerProfile.portfolio.editModal.title")
          : t("engineerProfile.portfolio.addModal.title")
      }
      subTitle={
        isEdit
          ? t("engineerProfile.portfolio.editModal.subtitle")
          : t("engineerProfile.portfolio.addModal.subtitle")
      }
      openButton={
        portfolio ? (
          <Button type="button" size="sm" variant="outline">
            {t("engineerProfile.portfolio.actions.edit")}
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            {t("engineerProfile.portfolio.add")}
          </Button>
        )
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleSave(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <Input
            label={t("engineerProfile.portfolio.fields.title")}
            placeholder={t("engineerProfile.portfolio.placeholders.title")}
            required={true}
            fieldName="title"
            errors={errors}
            {...register("title")}
          />

          <Textarea
            label={t("engineerProfile.portfolio.fields.description")}
            placeholder={t("engineerProfile.portfolio.placeholders.description")}
            rows={4}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="number"
              label={t("engineerProfile.portfolio.fields.year")}
              required={true}
              fieldName="year"
              errors={errors}
              {...register("year")}
            />
            <Input
              type="number"
              label={t("engineerProfile.portfolio.fields.projectId")}
              fieldName="projectId"
              errors={errors}
              {...register("projectId")}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm text-foreground">
              <ImagePlus className="h-4 w-4 text-primary" />
              {t("engineerProfile.portfolio.fields.attachments")}
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200/30 py-8 text-center transition-colors hover:border-primary">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("engineerProfile.portfolio.placeholders.dropzone")}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {thumbnails.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {thumbnails.map((att) => (
                  <div key={att.id} className="group relative h-20 w-20">
                    <img
                      src={att.url}
                      alt={att.description}
                      className="h-20 w-20 rounded-lg border border-gray-300 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((x) => x.id !== att.id),
                        )
                      }
                      className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.portfolio.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {isEdit
                ? t("engineerProfile.portfolio.editModal.submit")
                : t("engineerProfile.portfolio.addModal.submit")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default PortfolioModal;
