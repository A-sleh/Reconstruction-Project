import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import PopuupLayout from "@/components/layouts/Popup-layout";
import { landFormSchema, type LandFormSchema, useUpdateLand } from "../api/actions";
import { ZONING_LABELS, EZoningType, type LandDetail } from "../api/types";
import { parsingTheStringToEnum } from "@/lib/helpers";

interface EditLandPopupProps {
  land: LandDetail;
}

export default function EditLandPopup({ land }: EditLandPopupProps) {
  const { t } = useTranslation();
  const { mutate: updateLand, isPending } = useUpdateLand();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LandFormSchema>({
    resolver: zodResolver(landFormSchema),
    defaultValues: {
      name: land.name,
      address: land.address,
      location: `${land.location.latitude},${land.location.longitude}`,
      area: land.area,
      zoning: parsingTheStringToEnum<EZoningType>(ZONING_LABELS, land.zoningType),
      border: land.border.map((b) => `${b.latitude},${b.longitude}`),
      isValidated: land.isValidated,
      accessability: land.accessability,
      coverImageId: land.coverImageUrl ?? "",
      attachments: land.attachments ?? [],
    },
  });

  const zoningValue = watch("zoning");
  const accessabilityValue = watch("accessability");

  useEffect(() => {
    reset({
      name: land.name,
      address: land.address,
      location: `${land.location.latitude},${land.location.longitude}`,
      area: land.area,
      zoning: parsingTheStringToEnum<EZoningType>(ZONING_LABELS, land.zoningType),
      border: land.border.map((b) => `${b.latitude},${b.longitude}`),
      isValidated: land.isValidated,
      accessability: land.accessability,
      coverImageId: land.coverImageUrl ?? "",
      attachments: land.attachments ?? [],
    });
  }, [land, reset]);

  const onSubmit = (data: LandFormSchema) => {
    updateLand(
      { ...data, id: String(land.landId) },
      { onSuccess: () => {} },
    );
  };

  return (
    <PopuupLayout
      openKey="edit-land"
      title={t("investor.edit-land")}
      openButton={
        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    >
      {(closePopup) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label={t("investor.label-name")}
              id="edit-land-name"
              placeholder={t("investor.placeholder-name")}
              fieldName="name"
              errors={errors}
              {...register("name")}
            />
            <Input
              label={t("investor.label-address")}
              id="edit-land-address"
              placeholder={t("investor.placeholder-address")}
              fieldName="address"
              errors={errors}
              {...register("address")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="number"
              label={t("investor.label-area")}
              id="edit-land-area"
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closePopup()}
              disabled={isPending}
            >
              {t("investor.btn-cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("common.loading", "Saving...")
                : t("investor.btn-save")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
}
