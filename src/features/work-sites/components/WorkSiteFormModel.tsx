import { useEffect } from "react";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ImageUploader from "@/components/inputs/ImageUploader";
import Input from "@/components/inputs/Input";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";
import { Button } from "@/components/ui/button";
import WorkSiteType from "@/features/work-sites/components/WorkSiteType";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getDominImageURL } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  initialSiteValues,
  siteFormSchema,
  SiteFormValues,
  useCreateWorkSite,
  useUpdateWorkSite,
} from "../api/actions";
import { WorkSite } from "../api/types";

interface Props {
  openKey: string;
  initial?: WorkSite | null;
  openButton?: React.ReactNode | null;
}

export function WorkSiteFormModel({
  initial = null,
  openButton,
  openKey,
}: Props) {
  const { t } = useTranslation();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: initialSiteValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  // Watch the status value to keep the Radix Select component in sync
  // const logoFile = watch("file");
  const companyLocationValue = watch("location");
  const workSiteType = watch("workSiteType");
  const preventUpdateWorkSiteType = initial != null;

  const { previewUrl, isPending, onChange } = useFileUpload({
    onSuccess: (id) => {
      setValue("logoId", id);
    },
  });

  const handleImageChange = (selectedFile: File | null) => {
    onChange(selectedFile);
    if (!selectedFile) {
      setValue("logoId", "");
      setValue("file", undefined);
    }
  };

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    if (initial)
      reset({
        name: initial?.name ?? "",
        workSiteType: initial?.workSiteType ?? "",
        logoURL: initial?.logo.id.toString() ?? "",
        location: initial?.location ?? "",
        address: initial?.address ?? "",
      });
  }, [initial, reset]);

  const { mutate: createWorkSite, isPending: isCreated } = useCreateWorkSite();
  const { mutate: updateWorkSite, isPending: isUpdated } = useUpdateWorkSite();

  const onSubmit = (data: SiteFormValues, close: () => void) => {
    if (initial) {
      updateWorkSite(
        //@ts-ignore
        { ...data, id: initial.id },
        {
          onSuccess: () => {
            reset();
            close?.();
          },
        },
      );
    } else {
      createWorkSite(data, {
        onSuccess: () => {
          reset();
          close?.();
        },
      });
    }
  };

  const isLoading = isCreated || isUpdated || isPending;

  return (
    <PopuupLayout
      openKey={openKey}
      title={
        initial
          ? t("workSites.edit-site-heading")
          : t("workSites.add-site-heading")
      }
      subTitle={t("workSites.sub-heading-description")}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("workSites.new-site")}
          </Button>
        )
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Site Name Field */}
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("workSites.label-site-name")}
              id="site-name"
              placeholder={t("workSites.placeholder-site-name")}
              fieldName="name"
              errors={errors}
              {...register("name")}
            />
            <Input
              label={t("workSites.label-address")}
              id="address"
              placeholder={t("workSites.placeholder-address")}
              fieldName="address"
              errors={errors}
              {...register("address")}
            />
          </div>

          {/* Location & Manager Fields */}
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex gap-3 w-full">
              <div className="flex-1">
                <Input
                  type="text"
                  readOnly={true}
                  label={t("workSites.label-location")}
                  placeholder={t("workSites.placeholder-location")}
                  required={true}
                  fieldName="companyLoclocationation"
                  errors={errors}
                  value={companyLocationValue}
                  setValue={(value) => setValue("location", value)}
                  {...register("location")}
                />
              </div>
              <span className="mt-7">
                <PickCoordsFromMap
                  setValue={setValue}
                  value={companyLocationValue}
                />
              </span>
            </div>
            <div className="w-full" hidden={preventUpdateWorkSiteType}>
              <WorkSiteType
                label={t("auth.register.providor.registerType")}
                setValue={(value: string) => {
                  setValue("workSiteType", value);
                }}
                value={workSiteType}
                asInput={true}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <ImageUploader
              label={t("auth.register.providor.companyLogo")}
              required={true}
              onFileChange={handleImageChange}
              value={
                previewUrl ||
                getDominImageURL(initial?.logo?.url.toString() ?? "")
              }
              disabled={isPending}
              errors={errors ?? null}
              fieldName="logoURL"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button
                type="button"
                variant="outline"
                className="bg-red-400 text-white hover:opacity-80 transition-all"
              >
                {t("workSites.btn-cancel")}
              </Button>
            </Model.Close>
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              {isCreated || isUpdated
                ? t("common.loading", "Saving...")
                : initial
                  ? t("workSites.btn-save")
                  : t("workSites.btn-create")}
            </Button>
          </div>
        </form>
      )}
    />
  );
}
