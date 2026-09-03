import { useEffect, useRef } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormWizard, {
  type FormWizardStep,
} from "@/components/common/FormWizard";
import { Message } from "@/components/common/Message";
import ImageUploader from "@/components/inputs/ImageUploader";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import AttachmentList, {
  type AttachmentListHandle,
} from "@/features/attachment/components/AttachmentList";
import { useFileUpload } from "@/hooks/useFileUpload";
import { zodResolver } from "@hookform/resolvers/zod";

import LocationPickerField from "../../buildings/components/LocationPickerField";
import {
  initialLandValues,
  landFormSchema,
  type LandFormSchema,
  useCreateLand,
  useUpdateLand,
} from "../api/actions";
import { EZoningType, type Land, ZONING_LABELS } from "../api/types";
import BorderField from "./BorderField";

interface Props {
  initial?: Land | null;
  onSuccess?: () => void;
}

const STEPS: FormWizardStep[] = [
  {
    key: "basicInformation",
    label: "basicInformation",
    fields: ["name", "address", "accessability"],
  },
  {
    key: "locationArea",
    label: "locationArea",
    fields: ["location", "area", "zoning", "border"],
  },
  { key: "mediaAttachments", label: "mediaAttachments", fields: [] },
];

export default function BasicLandInfoForm({
  initial = null,
  onSuccess,
}: Props) {
  const { t } = useTranslation();

  const methods = useForm<LandFormSchema>({
    resolver: zodResolver(landFormSchema),
    defaultValues: initialLandValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const attachmentListRef = useRef<AttachmentListHandle>(null);

  const borderValue = watch("border");
  const zoningValue = watch("zoning");
  const locationValue = watch("location");
  const accessabilityValue = watch("accessability");

  const {
    previewUrl: coverPreviewUrl,
    fileId: coverFileId,
    isPending: isUploading,
    onChange: onCoverChange,
  } = useFileUpload({
    onSuccess: (id) => setValue("coverImageId", id),
  });

  useEffect(() => {
    if (initial) {
      reset({
        name: initial?.name ?? "",
        address: initial?.address ?? "",
        location: initial?.location ?? "",
        area: initial?.area ?? 0,
        zoning: initial?.zoning ?? EZoningType.Residential,
        border: initial?.border ?? [],
        isValidated: initial?.isValidated ?? false,
        accessability: initial?.accessability ?? false,
        coverImageId: initial?.coverImageId ?? "",
      });
    }
  }, [initial, reset]);

  const { mutate: createLand, isPending: isCreating } = useCreateLand();
  const { mutate: updateLand, isPending: isUpdating } = useUpdateLand();

  const isPending = isCreating || isUpdating || isUploading;

  const onSubmit = (data: LandFormSchema) => {
    const attachments = attachmentListRef.current?.getValues() ?? [];
    const payload = {
      ...data,
      attachments: attachments.map((a) => ({ ...a, removed: false })),
    };

    if (initial) {
      updateLand(
        { ...payload, id: initial.id },
        {
          onSuccess: () => {
            reset();
            onSuccess?.();
          },
        },
      );
    } else {
      createLand(payload, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label={t("investor.label-name")}
                id="land-name"
                placeholder={t("investor.placeholder-name")}
                fieldName="name"
                errors={errors}
                {...register("name")}
              />
              <Input
                label={t("investor.label-address")}
                id="land-address"
                placeholder={t("investor.placeholder-address")}
                fieldName="address"
                errors={errors}
                {...register("address")}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={accessabilityValue}
                onChange={(e) => setValue("accessability", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">
                {t("investor.label-accessibility")}
              </span>
            </label>
          </>
        );

      case 1:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <LocationPickerField
                value={locationValue ?? ""}
                onChange={(val) =>
                  setValue("location", val, { shouldValidate: true })
                }
                error={errors.location?.message}
              />
              <Input
                type="number"
                label={t("investor.label-area")}
                id="land-area"
                placeholder={t("investor.placeholder-area")}
                fieldName="area"
                errors={errors}
                {...register("area", { valueAsNumber: true })}
              />
              <div className="w-full">
                <label className="text-[11px] text-muted-foreground mb-1.5 md:text-sm block"></label>
                <Select
                  asInput={true}
                  label={t("investor.label-zoning")}
                  value={String(zoningValue)}
                  setValue={(val) =>
                    setValue("zoning", Number(val) as EZoningType)
                  }
                >
                  {Object.entries(ZONING_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
                {errors.zoning && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.zoning.message}
                  </p>
                )}
              </div>
            </div>

            <BorderField
              value={borderValue || []}
              onChange={(val) => setValue("border", val)}
              error={errors.border?.message}
            />
          </>
        );

      case 2:
        return (
          <>
            <ImageUploader
              label={t("investor.label-cover-image", "Cover Image")}
              accept="image/*"
              disabled={isPending || isUploading}
              value={coverPreviewUrl ?? (coverFileId || null)}
              onFileChange={onCoverChange}
              errors={errors}
              fieldName="coverImageId"
            />

            <Message
              type="info"
              message={t(
                "investor.attachments-hint",
                "Upload plans, designs, or any documents related to this land",
              )}
            />

            <AttachmentList ref={attachmentListRef} mode="self-contained" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <FormWizard
        steps={STEPS.map((s) => ({ ...s, label: t(`investor.${s.label}`) }))}
        onSubmit={handleSubmit(onSubmit)}
        isPending={isPending}
        submitLabel={
          isPending
            ? t("investor.loading")
            : initial
              ? t("investor.btn-save")
              : t("investor.btn-create")
        }
        nextLabel={t("investor.next")}
        backLabel={t("investor.back")}
        cancelLabel={t("investor.btn-cancel")}
        onCancel={() => reset()}
      >
        {renderStep}
      </FormWizard>
    </FormProvider>
  );
}
