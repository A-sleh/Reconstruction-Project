import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import {
  landFormSchema,
  initialLandValues,
  type LandFormSchema,
  useCreateLand,
  useUpdateLand,
} from "../api/actions";
import { ZONING_LABELS, EZoningType, type Land } from "../api/types";
import BorderField from "./BorderField";

interface Props {
  initial?: Land | null;
  onSuccess?: () => void;
}

export default function BasicLandInfoForm({ initial = null, onSuccess }: Props) {
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

  const borderValue = watch("border");
  const zoningValue = watch("zoning");
  const accessabilityValue = watch("accessability");

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name ?? "",
        address: initial.address ?? "",
        location: initial.location ?? "",
        area: initial.area ?? 0,
        zoning: initial.zoning ?? EZoningType.Residential,
        border: initial.border ?? [],
        isValidated: initial.isValidated ?? false,
        accessability: initial.accessability ?? false,
        coverImageUrl: initial.coverImageUrl ?? "",
      });
    }
  }, [initial, reset]);

  const { mutate: createLand, isPending: isCreating } = useCreateLand();
  const { mutate: updateLand, isPending: isUpdating } = useUpdateLand();

  const onSubmit = (data: LandFormSchema) => {
    if (initial) {
      updateLand(
        { ...data, id: initial.id },
        { onSuccess: () => { reset(); onSuccess?.(); } },
      );
    } else {
      createLand(data, {
        onSuccess: () => { reset(); onSuccess?.(); },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-canvas-elevated rounded-md border border-gray-300 bg-white"
    >
      <div className="flex flex-col gap-4 md:flex-row">
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

      <div className="flex flex-col gap-4 md:flex-row">
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
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full">
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            {t("investor.label-zoning")}
          </label>
          <select
            value={zoningValue}
            onChange={(e) => setValue("zoning", Number(e.target.value) as EZoningType)}
            className="w-full h-10 rounded-md border border-border bg-canvas-elevated px-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
          >
            {Object.entries(ZONING_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {errors.zoning && (
            <p className="text-xs text-destructive mt-1">{errors.zoning.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessabilityValue}
            onChange={(e) => setValue("accessability", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">{t("investor.label-accessibility")}</span>
        </label>
      </div>

      <BorderField
        value={borderValue}
        onChange={(val) => setValue("border", val)}
        error={errors.border?.message}
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
