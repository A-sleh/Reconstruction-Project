import { type RefObject } from "react";

import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import DateField from "@/components/inputs/DateFiled";
import Input from "@/components/inputs/Input";
import RichTextBoard from "@/components/inputs/RichTextBoard";
import { Textarea } from "@/components/ui/textarea";
import AttachmentList, {
  type AttachmentListHandle,
} from "@/features/attachment/components/AttachmentList";

export interface BaseReportStepProps {
  attachmentRef: RefObject<AttachmentListHandle | null>;
  attachmentFields: {
    id: number;
    name?: string;
    description?: string;
    url?: string;
  }[];
  onUpload: (file: File) => void;
  onRemove: (idx: number) => void;
}

const BaseRerpotInfo = ({
  attachmentRef,
  attachmentFields,
  onUpload,
  onRemove,
}: BaseReportStepProps) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const contentValue = watch("content") ?? "";
  const reportDate = watch("reportDate") ?? "";

  return (
    <div className="space-y-6">
      <Input
        label={t("projectReports.create.base.titleLabel", "Title")}
        placeholder={t(
          "projectReports.create.base.titlePlaceholder",
          "Enter a descriptive title for the report...",
        )}
        fieldName="title"
        errors={errors}
        required
        {...register("title")}
      />

      <Textarea
        label={t("projectReports.create.base.descriptionLabel", "Description")}
        placeholder={t(
          "projectReports.create.base.descriptionPlaceholder",
          "Briefly describe what this report covers...",
        )}
        fieldName="description"
        errors={errors}
        required
        className="min-h-24"
        {...register("description")}
      />

      <RichTextBoard
        label={t("projectReports.create.base.contentLabel", "Content")}
        placeholder={t(
          "projectReports.create.base.contentPlaceholder",
          "Write the full report content...",
        )}
        fieldName="content"
        errors={errors}
        value={contentValue}
        onChange={(html) => setValue("content", html, { shouldValidate: true })}
        className="bg-white"
      />

      <DateField
        value={reportDate}
        onChange={(v) => setValue("reportDate", v)}
        label={t("projectReports.create.base.dateLabel", "Report Date")}
      />

      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            {t("projectReports.create.base.attachmentsLabel", "Attachments")}
          </p>
        </div>
        <AttachmentList
          ref={attachmentRef}
          mode="legacy"
          fields={attachmentFields}
          register={register}
          errors={errors}
          basePath="attachments"
          onUpload={onUpload}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default BaseRerpotInfo;
