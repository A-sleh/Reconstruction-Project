import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Select from "@/components/inputs/Selector";
import Input from "@/components/inputs/Input";
import ImageUploader from "@/components/inputs/ImageUploader";
import {
  landFormSchema,
  initialLandValues,
  type LandFormSchema,
  useCreateLand,
  useUpdateLand,
} from "../api/actions";
import { ZONING_LABELS, EZoningType, type Land } from "../api/types";
import { useFileUpload } from "@/hooks/useFileUpload";
import BorderField from "./BorderField";
import AttachmentList, { type AttachmentListHandle } from "@/features/attachment/components/AttachmentList";
import { Message } from "@/components/common/Message";

interface Props {
  initial?: Land | null;
  onSuccess?: () => void;
}

export default function BasicLandInfoForm({
  initial = null,
  onSuccess,
}: Props) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LandFormSchema>({
    resolver: zodResolver(landFormSchema),
    defaultValues: initialLandValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const attachmentListRef = useRef<AttachmentListHandle>(null);

  const borderValue = watch("border");
  const zoningValue = watch("zoning");
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
        coverImageId: initial?.coverImageUrl ?? "",
      });
    }
  }, [initial, reset]);

  const { mutate: createLand, isPending: isCreating } = useCreateLand();
  const { mutate: updateLand, isPending: isUpdating } = useUpdateLand();

  const isPending = isCreating || isUpdating || isUploading;

  const onSubmit = (data: LandFormSchema) => {
    const attachments = attachmentListRef.current?.getValues() ?? [];
    const payload = { ...data, attachments: attachments.map((a) => ({ ...a, removed: false })) };

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-6 bg-canvas-elevated rounded-md border border-gray-300 bg-white"
    >
      {/* Row 1: Name + Address */}
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

      {/* Row 2: Location + Area + Zoning */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label={t("investor.label-location")}
          id="land-location"
          placeholder={t("investor.placeholder-location")}
          fieldName="location"
          errors={errors}
          {...register("location")}
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
            setValue={(val) => setValue("zoning", Number(val) as EZoningType)}
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

      {/* Row 3: Accessibility */}
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

      {/* Cover Image */}
      <ImageUploader
        label={t("investor.label-cover-image", "Cover Image")}
        accept="image/*"
        disabled={isPending || isUploading}
        value={coverPreviewUrl ?? (coverFileId || null)}
        onFileChange={onCoverChange}
        errors={errors}
        fieldName="coverImageId"
      />

      <BorderField
        value={borderValue || []}
        onChange={(val) => setValue("border", val)}
        error={errors.border?.message}
      />

      <Message
        type="info"
        message={t(
          "investor.attachments-hint",
          "Upload plans, designs, or any documents related to this land",
        )}
      />

      <AttachmentList
        ref={attachmentListRef}
        mode="self-contained"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isPending}
        >
          {t("investor.btn-cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("common.loading", "Saving...")
            : initial
              ? t("investor.btn-save")
              : t("investor.btn-create")}
        </Button>
      </div>
    </form>
  );
}
