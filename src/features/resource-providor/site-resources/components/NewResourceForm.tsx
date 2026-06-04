import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResourceAvailability,
  UnitType,
} from "@/data/resource-providor/mockData";
import { useTranslation } from "react-i18next";
import {
  defaultResourceValues,
  Resource,
  resourceSchema,
} from "../api/actions";
import ImageUploader from "@/components/inputs/ImageUploader";
import { availabilities, unitTypes } from "../api";
import { DynamicAsyncSelector } from "./SmartDataGrid";

interface Props {
  openButton?: React.ReactNode;
  initial?: Resource | null;
  onSubmit?: (values: Resource) => void;
}

export function NewResourceForm({ initial, onSubmit }: Props) {
  const { t } = useTranslation();

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
  } = useForm<Resource>({
    resolver: zodResolver(resourceSchema) as any,
    defaultValues: defaultResourceValues,
    mode: "onChange",
  });

  const watched = watch();
  const unitType = watched.unit;
  const image = watched.imageUrl;
  const localImageFile = watched?.file;
  const availability = watched.availability;
  const resourceBank = watched.resourceBank;

  

  console.log(resourceBank,"<==== here");

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    if (initial)
      reset({
        availability: initial?.availability ?? "",
        description: initial?.description ?? "",
        file: initial?.file,
        imageUrl: initial?.imageUrl ?? "",
        price: initial?.price ?? 0,
        resourceBankId: initial?.resourceBankId ?? 0,
        resourceBank: initial?.resourceBank ?? null,
        unit: initial?.unit ?? "",
      });
  }, [initial, reset]);

  const handleImageChange = (file: File | null) => {
    setValue("imageUrl", file?.name ?? "");
    setValue("file", file ?? undefined);
  };

  const handleFormSubmit = (values: Resource) => {
    if (onSubmit) {
      onSubmit(values);
      reset(defaultResourceValues);
      return;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="w-full  rounded-xl border border-gray-300 bg-white overflow-hidden flex-1"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 p-6 overflow-auto max-h-130 relative w-full"
        style={{ scrollbarWidth: "none" }}
      >
        {/* resource description  */}
        <div className="space-y-4">
          <Textarea
            label={t("resourceProvidor.workSites.resource.label-description")}
            placeholder={t(
              "resourceProvidor.workSites.resource.placeholder-description",
            )}
            rows={3}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label={t(
                "resourceProvidor.workSites.resource.label-availability",
              )}
              fieldName="availability"
              errors={errors}
              value={availability}
              setValue={(v) =>
                setValue("availability", v as ResourceAvailability)
              }
            >
              {availabilities.map((a) => (
                <option key={a} value={a}>
                  {t(`resourceProvidor.workSites.resource.availability.${a}`)}
                </option>
              ))}
            </Select>
          </div>

          <DynamicAsyncSelector
            placeholder="ابحث عن الإسمنت أو المواد هنا..."
            value={watched.resourceBank}
            onSelect={(selected) => {
              setValue("resourceBankId", Number(selected?.id));
              setValue("resourceBank", selected);
            }}
          />
        </div>

        {/* unit price & quanitty & unit type  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label={t("resourceProvidor.workSites.resource.label-unit-type")}
              fieldName="unit"
              errors={errors}
              value={unitType}
              setValue={(v) => setValue("unit", v as UnitType)}
            >
              {unitTypes.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label={t(
              "resourceProvidor.workSites.resource.label-price-per-unit",
            )}
            id="price"
            type="number"
            min={0}
            step="0.01"
            fieldName="price"
            errors={errors}
            {...register("price")}
          />
        </div>

        <ImageUploader
          label={t("resourceProvidor.workSites.resource.label-image")}
          required={true}
          fileName={"imageUrl"}
          value={localImageFile || image}
          onFileChange={handleImageChange}
          errors={errors ?? null}
          fieldName="imageUrl"
        />

        {/* Controlers buttons  */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit">
            {initial
              ? t("resourceProvidor.workSites.btn-save")
              : t("resourceProvidor.workSites.resource.btn-create")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
