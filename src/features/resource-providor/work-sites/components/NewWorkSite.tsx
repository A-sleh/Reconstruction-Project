import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import Model from "@/components/model/Model";
import { useTranslation } from "react-i18next";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";
import {
  initialSiteValues,
  siteFormSchema,
  SiteFormValues,
  useCreateWorkSite,
  useUpdateWorkSite,
} from "../api/actions";
import { WorkSite } from "../api";
import ImageUploader from "@/components/inputs/ImageUploader";
import WorkSiteType from "../../shared/WorkSiteType";

interface Props {
  initial?: WorkSite | null;
  openButton?: React.ReactNode | null;
}

export function NewWorkSite({ initial = null, openButton }: Props) {
  const { t } = useTranslation();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

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
  const logoFile = watch("file");
  const logoUrl = watch("logoURL");
  const companyLocationValue = watch("location");
  const workSiteType = watch("workSiteType");
  const preventUpdateWorkSiteType = initial != null;

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    if (initial)
      reset({
        name: initial?.name ?? "",
        workSiteType: initial?.workSiteType ?? "",
        logoURL: initial?.logoURL ?? "",
        location: initial?.location ?? "",
        address: initial?.address ?? "",
      });
  }, [initial, reset]);

  const handleImageChange = (file: File | null) => {
    setValue("logoURL", file?.name ?? "");
    setValue("file", file ?? undefined);
  };

  const { mutate: createWorkSite, isPending: isCreated } = useCreateWorkSite();
  const { mutate: updateWorkSite, isPending: isUpdated } = useUpdateWorkSite();

  const onSubmit = (data: SiteFormValues) => {
    if (initial) {
      updateWorkSite(
        { ...data, id: initial.id },
        {
          onSuccess: () => {
            reset();
            if (closeBtnRef.current) {
              closeBtnRef.current.click();
            }
          },
        },
      );
    } else {
      createWorkSite(data, {
        onSuccess: () => {
          reset();
          if (closeBtnRef.current) {
            closeBtnRef.current.click();
          }
        },
      });
    }
  };

  return (
    <Model>
      <Model.Open opens="new-work-site">
        {openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("resourceProvidor.workSites.new-site")}
          </Button>
        )}
      </Model.Open>
      <Model.Window name="new-work-site">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-gray-300 bg-white shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {initial
                    ? t("resourceProvidor.workSites.edit-site-heading")
                    : t("resourceProvidor.workSites.add-site-heading")}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("resourceProvidor.workSites.sub-heading-description")}
                </p>
              </div>
              <Model.Close>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                  ref={closeBtnRef}
                >
                  <X className="h-4 w-4" />
                </button>
              </Model.Close>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 p-6 overflow-auto max-h-130"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Site Name Field */}
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  label={t("resourceProvidor.workSites.label-site-name")}
                  id="site-name"
                  placeholder={t(
                    "resourceProvidor.workSites.placeholder-site-name",
                  )}
                  fieldName="name"
                  errors={errors}
                  {...register("name")}
                />
                <Input
                  label={t("resourceProvidor.workSites.label-address")}
                  id="address"
                  placeholder={t(
                    "resourceProvidor.workSites.placeholder-address",
                  )}
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
                      label={t("resourceProvidor.workSites.label-location")}
                      placeholder={t(
                        "resourceProvidor.workSites.placeholder-location",
                      )}
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
                  value={logoFile || logoUrl}
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
                    {t("resourceProvidor.workSites.btn-cancel")}
                  </Button>
                </Model.Close>
                <Button type="submit" disabled={isCreated || isUpdated}>
                  {isCreated || isUpdated
                    ? t("common.loading", "Saving...")
                    : initial
                      ? t("resourceProvidor.workSites.btn-save")
                      : t("resourceProvidor.workSites.btn-create")}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Model.Window>
    </Model>
  );
}
