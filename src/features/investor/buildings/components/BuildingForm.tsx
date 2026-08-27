import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { MapPin, Pencil, Building2, Paperclip } from "lucide-react";
import FormWizard, {
  type FormWizardStep,
} from "@/components/common/FormWizard";
import Input from "@/components/inputs/Input";
import ImageUploader from "@/components/inputs/ImageUploader";
import LandMap from "@/components/shared/LandMap/LandMap";
import {
  buildingFormSchema,
  initialBuildingValues,
  type BuildingFormSchema,
  useCreateBuilding,
} from "../api/actions";
import { BUILDING_TYPES } from "./BuildingTypes";
import { useFileUpload } from "@/hooks/useFileUpload";
import LocationPickerField from "./LocationPickerField";
import AttachmentList, { type AttachmentListHandle } from "@/features/attachment/components/AttachmentList";
import type { ILoncation } from "@/features/investor/lands-buildings/api/types";

interface BuildingFormProps {
  landId: number;
  landBorder?: ILoncation[];
  onSuccess?: () => void;
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

const STEPS: FormWizardStep[] = [
  {
    key: "basicInformation",
    label: "basicInformation",
    fields: ["name", "address", "city", "streetName", "buildingType", "orientation"],
  },
  {
    key: "locationArea",
    label: "locationArea",
    fields: ["location", "area"],
  },
  {
    key: "buildingBorder",
    label: "buildingBorder",
    fields: [],
  },
  {
    key: "mediaAttachments",
    label: "mediaAttachments",
    fields: [],
  },
];

export default function BuildingForm({ landId, landBorder, onSuccess }: BuildingFormProps) {
  const { t } = useTranslation();

  const methods = useForm<BuildingFormSchema>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: { ...initialBuildingValues, landId },
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

  const {
    previewUrl: coverPreviewUrl,
    fileId: coverFileId,
    isPending: isUploadingCover,
    onChange: onCoverChange,
  } = useFileUpload({
    onSuccess: (id) => setValue("coverImageId", Number(id)),
  });

  const locationValue = watch("location");
  const buildingBorderValue = watch("buildingBorder");

  useEffect(() => {
    reset({ ...initialBuildingValues, landId });
  }, [landId, reset]);

  const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();

  const isPending = isCreating || isUploadingCover;

  const onSubmit = (data: BuildingFormSchema) => {
    const attachments = attachmentListRef.current?.getValues() ?? [];
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
      buildingBorder: data.buildingBorder.map((p) => `${p.lat},${p.lng}`),
      attachments: attachments.map((a) => ({
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

  const constraintLatLng = landBorder?.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
  }));

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 pt-4">
            <SectionHeader icon={Building2} title={t("investor.basicInformation", "Basic Information")} />
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
                placeholder={t("investor.placeholder-streetName", "Enter street name")}
                fieldName="streetName"
                errors={errors}
                {...register("streetName")}
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
                placeholder={t("investor.placeholder-orientation", "e.g. North, South...")}
                fieldName="orientation"
                errors={errors}
                {...register("orientation")}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pt-4">
            <SectionHeader icon={MapPin} title={t("investor.locationArea", "Location & Area")} />
            <div className="flex flex-col gap-4 md:flex-row">
              <LocationPickerField
                value={locationValue ?? ""}
                onChange={(val) => setValue("location", val, { shouldValidate: true })}
                error={errors.location?.message}
                landBorder={landBorder}
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 pt-4">
            <SectionHeader icon={Pencil} title={t("investor.buildingBorder", "Building Border")} />
            <p className="text-xs text-muted-foreground">
              {t("investor.drawBorderHint", "Click inside the land boundary to place points. Close the polygon to finish.")}
            </p>
            <div className="rounded-lg overflow-hidden border border-border">
              <LandMap
                mode="edit"
                value={buildingBorderValue ?? []}
                onChange={(val) => setValue("buildingBorder", val)}
                polygon={constraintLatLng}
                constraintPolygon={constraintLatLng}
                maxPoints={20}
                height="400px"
              />
            </div>
            {(buildingBorderValue?.length ?? 0) > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("investor.borderPoints", {
                  count: buildingBorderValue.length,
                  defaultValue: "{{count}} points",
                }).replace("{{count}}", String(buildingBorderValue.length))}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 pt-4">
            <SectionHeader icon={Paperclip} title={t("investor.mediaAttachments", "Media & Attachments")} />
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
              ref={attachmentListRef}
              mode="self-contained"
            />
          </div>
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
            ? t("common.loading", "Saving...")
            : t("investor.btn-create")
        }
        nextLabel={t("investor.next")}
        backLabel={t("investor.back")}
        cancelLabel={t("investor.btn-cancel")}
        onCancel={() => reset({ ...initialBuildingValues, landId })}
        className="rounded-lg border border-border bg-white"
      >
        {renderStep}
      </FormWizard>
    </FormProvider>
  );
}
