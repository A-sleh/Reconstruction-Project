import { useEffect } from "react";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ImageUploader from "@/components/inputs/ImageUploader";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UnitType } from "@/data/resource-providor/mockData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getDominImageURL } from "@/lib/helpers";
import { useAuthStore, User } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  defaultResourceValues,
  Resource,
  ResourceFormValues,
  resourceSchema,
  useUpdateResource,
} from "../api/actions";
import { unitTypes } from "../api/types";
import { getRolePrefix } from "./NewResorceRequestModel";
import { DynamicAsyncSelector } from "./SmartDataGrid";

interface Props {
  openButton?: React.ReactNode;
  initial?: Resource | null;
  onSubmit?: (values: Resource) => void;
  onSateled?: () => void;
  updateable?: boolean;
  fromWorkSiteId?: number;
}

export function NewResourceForm({
  initial,
  onSubmit,
  updateable = false,
  onSateled,
  fromWorkSiteId,
}: Props) {
  const { t } = useTranslation();
  const providerRole =
    useAuthStore((s) => (s.user as User)?.providerRole) ?? "Resource";
  const rolePrefix = getRolePrefix(providerRole);
  const { mutate: updateResource, isPending: resouceIsUpdated } =
    useUpdateResource();

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    getValues,
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema) as any,
    defaultValues: defaultResourceValues as ResourceFormValues,
    mode: "onChange",
  });
  const { isPending, onChange, previewUrl } = useFileUpload({
    onSuccess: (id) => {
      setValue("imageId", id.toString() ?? "");
    },
  });
  console.log(getValues());
  const watched = watch();
  const unitType = watched.unit;
  const isAvailable = watched.isAvailable;
  const localImageFile = watched?.file;

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    reset({
      isAvailable: initial?.isAvailable ?? true,
      description: initial?.description ?? "",
      file: initial?.file,
      imageUrl: initial?.imageId?.id ? initial?.imageId?.id.toString() : "",
      price: initial?.price ?? 0,
      unit: initial?.unit ?? "",
      resourceBank: updateable ? null : (initial?.resourceBank ?? null),
      resourceBankId: updateable ? null : (initial?.resourceBankId ?? 0),
      workSiteId: fromWorkSiteId ? fromWorkSiteId.toString() : null,
      id: initial?.id?.toString() ?? null,
    });
  }, [fromWorkSiteId, initial, reset, updateable]);

  const handleImageChange = (selectedFile: File | null) => {
    onChange(selectedFile);
    if (!selectedFile) {
      setValue("imageId", "");
      setValue("imageUrl", "");
      setValue("file", undefined);
    } else {
      setValue("file", selectedFile);
    }
  };

  const handleFormSubmit = (values: Resource) => {
    if (onSubmit && !updateable) {
      onSubmit(values);
      reset(defaultResourceValues);
      return;
    } else if (updateable && onSateled) {
      updateResource(values, {
        onSuccess: (_) => {
          onSateled();
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="w-full  overflow-hidden flex-1"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 p-2 overflow-auto max-h-130 relative w-full"
        style={{ scrollbarWidth: "none" }}
      >
        {/* resource description  */}
        <div className="space-y-4">
          <Textarea
            label={t(`${rolePrefix}.form.label-description`)}
            placeholder={t(`${rolePrefix}.form.placeholder-description`)}
            rows={3}
            fieldName="description"
            errors={errors}
            {...register(`description`)}
          />
        </div>

        {!updateable && (
          <DynamicAsyncSelector
            placeholder="ابحث عن الإسمنت أو المواد هنا..."
            value={watched.resourceBank}
            onSelect={(selected) => {
              setValue("resourceBankId", Number(selected?.id));
              setValue("resourceBank", selected);
            }}
          />
        )}

        {/* unit price & quanitty & unit type  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 flex-1">
            <Select
              label={t(`${rolePrefix}.form.label-unit-type`)}
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
            label={t(`${rolePrefix}.form.label-price-per-unit`)}
            id="price"
            type="number"
            min={0}
            step="0.01"
            fieldName="price"
            className="flex-1"
            errors={errors}
            {...register(`price`)}
          />
          <div className="space-y-2 flex flex-col gap-2">
            <label className={`text-sm`}>
              {t(`${rolePrefix}.form.isAvailable-label`)}
            </label>
            <Switch
              checked={isAvailable as boolean}
              onCheckedChange={(checked) => {
                setValue("isAvailable", checked);
              }}
            />
          </div>
        </div>

        <ImageUploader
          label={t(`${rolePrefix}.form.label-image`)}
          required={true}
          fileName={"imageUrl"}
          value={
            previewUrl
              ? previewUrl
              : initial && initial.image?.url
                ? getDominImageURL(initial.image?.url)
                : previewUrl || localImageFile
          }
          disabled={isPending}
          onFileChange={handleImageChange}
          errors={errors ?? null}
          fieldName="imageUrl"
        />

        {/* Controlers buttons  */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <Button
            isLoading={resouceIsUpdated || isPending}
            disabled={isPending || resouceIsUpdated}
            type="submit"
          >
            {initial
              ? t(`${rolePrefix}.form.btn-save`)
              : t(`${rolePrefix}.form.btn-create`)}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
