import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import { SiteStatus, WorkSite } from "@/data/resource-providor/mockData";
import Model from "@/components/model/Model";
import { useTranslation } from "react-i18next";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";
import { siteFormSchema, SiteFormValues } from "../api/create";

interface Props {
  initial?: WorkSite | null;
  openButton?: React.ReactNode | null;
}

const statuses: SiteStatus[] = ["active", "on-hold", "completed"];

export function NewWorkSite({ initial, openButton }: Props) {
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
    defaultValues: {
      name: "",
      companyLocation: "",
      manager: "",
      status: "active",
      startDate: new Date().toISOString().slice(0, 10),
      progress: 0,
    },
  });

  // Watch the status value to keep the Radix Select component in sync
  const currentStatus = watch("status");
  const companyLocationValue = watch("companyLocation");

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      companyLocation: initial?.location ?? "",
      manager: initial?.manager ?? "",
      status: initial?.status ?? "active",
      startDate: initial?.startDate ?? new Date().toISOString().slice(0, 10),
      progress: initial?.progress ?? 0,
    });
  }, [initial, reset]);

  const onSubmit = (data: SiteFormValues) => {
    console.log("Form submitted with data:", data);
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
                >
                  <X className="h-4 w-4" />
                </button>
              </Model.Close>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
              {/* Site Name Field */}
              <div className="space-y-2">
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
              </div>

              {/* Location & Manager Fields */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    readOnly={true}
                    label={t("resourceProvidor.workSites.label-location")}
                    placeholder={t(
                      "resourceProvidor.workSites.placeholder-location",
                    )}
                    required={true}
                    fieldName="companyLocation"
                    errors={errors}
                    value={companyLocationValue}
                    setValue={(value) => setValue("companyLocation", value)}
                    {...register("companyLocation")}
                  />
                </div>
                <span className="mt-7">
                  <PickCoordsFromMap
                    setValue={setValue}
                    value={companyLocationValue}
                  />
                </span>
              </div>
              <div className="space-y-2">
                <Input
                  label={t("resourceProvidor.workSites.label-manager")}
                  id="site-manager"
                  placeholder={t(
                    "resourceProvidor.workSites.placeholder-manager",
                  )}
                  fieldName="manager"
                  errors={errors}
                  {...register("manager")}
                />
              </div>

              {/* Status, Start Date & Progress Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative z-100">
                  <Select
                    setValue={(v) =>
                      setValue("status", v as SiteStatus, {
                        shouldValidate: true,
                      })
                    }
                    value={currentStatus}
                    label={t("resourceProvidor.workSites.label-status")}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {t(`resourceProvidor.workSites.status-${s}`)}
                      </option>
                    ))}
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    label={t("resourceProvidor.workSites.label-start-date")}
                    id="site-date"
                    type="date"
                    fieldName="startDate"
                    errors={errors}
                    {...register("startDate")}
                  />
                </div>
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
                <Button type="submit">
                  {initial
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
