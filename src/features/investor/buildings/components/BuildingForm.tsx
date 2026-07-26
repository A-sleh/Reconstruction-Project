import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import ImageUploader from "@/components/inputs/ImageUploader";
import {
  buildingFormSchema,
  initialBuildingValues,
  type BuildingFormSchema,
  useCreateBuilding,
} from "../api/actions";
import { BUILDING_TYPES } from "./BuildingTypes";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useUploadFile } from "@/features/attachment/api/actions";
import LocationPickerField from "./LocationPickerField";
import AttachmentList from "@/features/attachment/components/AttachmentList";

interface BuildingFormProps {
  landId: number;
  onSuccess?: () => void;
}

export default function BuildingForm({ landId, onSuccess }: BuildingFormProps) {
  const { t } = useTranslation();
  const { mutate: uploadFile } = useUploadFile();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<BuildingFormSchema>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: { ...initialBuildingValues, landId },
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  });

  const {
    previewUrl: coverPreviewUrl,
    fileId: coverFileId,
    isPending: isUploadingCover,
    onChange: onCoverChange,
  } = useFileUpload({
    onSuccess: (id) => setValue("coverImageId", Number(id)),
  });

  // Attachment upload state
  const [pendingAttachments, setPendingAttachments] = useState<
    { id: number; description: string; name: string; url: string }[]
  >([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const locationValue = watch("location");

  useEffect(() => {
    reset({ ...initialBuildingValues, landId });
  }, [landId, reset]);

  const handleUploadAttachment = (file: File, idx: number) => {
    setUploadingIdx(idx);
    uploadFile(file, {
      onSuccess: (res) => {
        append({
          id: Number(res.fileId),
          description: "",
          name: file.name,
          url: URL.createObjectURL(file),
        });
        setUploadingIdx(null);
      },
      onError: () => {
        setUploadingIdx(null);
      },
    });
  };

  const handleRemoveAttachment = (idx: number) => {
    const field = fields[idx];
    if (field) {
      setPendingAttachments((prev) => [
        ...prev,
        {
          id: field.id,
          description: field.description,
          name: (field as any).name ?? "",
          url: (field as any).url ?? "",
        },
      ]);
      remove(idx);
    }
  };

  const handleRevertAttachment = (att: {
    id: number;
    description: string;
    name: string;
    url: string;
  }) => {
    append({
      id: att.id,
      description: att.description,
      name: att.name,
      url: att.url,
    });
    setPendingAttachments((prev) => prev.filter((a) => a.id !== att.id));
  };

  const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();

  const onSubmit = (data: BuildingFormSchema) => {
    const payload = {
      name: data.name,
      landId: data.landId,
      city: data.city,
      streetName: data.streetName,
      address: data.address,
      area: data.area,
      buildingType: data.buildingType as any,
      orientation: data.orientation,
      location: data.location,
      coverImageId: data.coverImageId,
      attachments: data.attachments.map((a) => ({
        id: a.id,
        description: a.description,
      })),
    };

    createBuilding(payload, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  const isPending = isCreating || isUploadingCover;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-canvas-elevated rounded-md border border-gray-300 bg-white"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          label={t("investor.label-name")}
          id="building-name"
          placeholder={t("investor.placeholder-name")}
          fieldName="name"
          errors={errors}
          {...register("name")}
        />
        <Input
          label={t("investor.label-address")}
          id="building-address"
          placeholder={t("investor.placeholder-address")}
          fieldName="address"
          errors={errors}
          {...register("address")}
        />
      </div>

      <Input
        label={t("investor.label-address123")}
        id="building-address"
        placeholder={t("investor.placeholder-address")}
        fieldName="address"
        errors={errors}
        {...register("landId")}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          label={t("investor.label-city", "City")}
          id="building-city"
          placeholder={t("investor.placeholder-city", "Enter city")}
          fieldName="city"
          errors={errors}
          {...register("city")}
        />
        <Input
          label={t("investor.label-streetName", "Street Name")}
          id="building-street"
          placeholder={t(
            "investor.placeholder-streetName",
            "Enter street name",
          )}
          fieldName="streetName"
          errors={errors}
          {...register("streetName")}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
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
          id="building-area"
          placeholder={t("investor.placeholder-area")}
          fieldName="area"
          errors={errors}
          {...register("area", { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full">
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            {t("investor.label-buildingType", "Building Type")}
          </label>
          <select
            {...register("buildingType")}
            className="w-full h-10 rounded-md border border-border bg-canvas-elevated px-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
          >
            <option value="">
              {t("investor.placeholder-select", "Select...")}
            </option>
            {BUILDING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.buildingType && (
            <p className="text-xs text-destructive mt-1">
              {errors.buildingType.message}
            </p>
          )}
        </div>
        <Input
          label={t("investor.label-orientation", "Orientation")}
          id="building-orientation"
          placeholder={t(
            "investor.placeholder-orientation",
            "e.g. North, South...",
          )}
          fieldName="orientation"
          errors={errors}
          {...register("orientation")}
        />
      </div>

      <ImageUploader
        label={t("investor.label-cover-image", "Cover Image")}
        accept="image/*"
        disabled={isPending || isUploadingCover}
        value={coverPreviewUrl ?? (coverFileId || null)}
        onFileChange={onCoverChange}
        errors={errors}
        fieldName="coverImageId"
      />

      <AttachmentList
        fields={fields as any}
        register={register}
        errors={errors}
        onUpload={(file) => handleUploadAttachment(file, fields.length)}
        onRemove={handleRemoveAttachment}
        onRevert={handleRevertAttachment}
        pendingItems={pendingAttachments}
        isUploading={uploadingIdx !== null}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset({ ...initialBuildingValues, landId })}
          disabled={isPending}
        >
          {t("investor.btn-cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("common.loading", "Saving...")
            : t("investor.btn-create")}
        </Button>
      </div>
    </form>
  );
}
