import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Selector";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Resource,
  ResourceAvailability,
  UnitType,
} from "@/data/resource-providor/mockData";
import { useTranslation } from "react-i18next";
import {
  defaultResourceValues,
  ResourceFormValues,
  resourceSchema,
  useCreateResource,
  useRequestToAddResource,
  useUpdateResource,
} from "../api/actions";
import Model from "@/components/model/Model";
import ImageUploader from "@/components/inputs/ImageUploader";
import { availabilities, initialCategories, unitTypes } from "../api";
import { useParams } from "react-router";

interface Props {
  openButton?: React.ReactNode;
  initial?: Resource | null;
}

const OTHER = "__other__";

export function ResourceModal({ openButton, initial }: Props) {
  const { t } = useTranslation();
  const { siteId = "" } = useParams();
  const closeBtnRef = useRef<null | HTMLButtonElement>(null);

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: defaultResourceValues,
    mode: "onSubmit",
  });

  const watched = watch();
  const unitType = watched.unitType;
  const image = watched.image;
  const category = watched.category;
  const availability = watched.availability;
  const isOther = category === OTHER;

  // Sync initial/incoming data with the form fields whenever the modal opens
  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      availability: initial?.availability ?? "",
      category: initial?.category ?? "",
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      unitType: initial?.unitType ?? "",
      pricePerUnit: initial?.pricePerUnit ?? 0,
      quantity: initial?.quantity ?? 0,
    });
  }, [initial, reset]);

  const { mutate: createResource, isPending: isCreated } = useCreateResource();
  const { mutate: updateResource, isPending: isUpdated } = useUpdateResource();
  const { mutate: requestToAddResource, isPending: isRequested } =
    useRequestToAddResource();

  const handleImageChange = (file: File | null) => {
    setValue("image", file?.name ?? "");
  };

  const onSubmit = (values: ResourceFormValues) => {
    console.log(values)
    if (initial) {
      updateResource({
        siteId: siteId,
        payload: { ...values, id: initial.id, siteId },
      });
    } else if (isOther) {
      requestToAddResource({
        siteId: siteId,
        payload: { ...values, id: initial?.id, siteId },
      });
    } else {
      createResource({
        siteId,
        payload: values,
      });
    }
  };

  console.log(errors);

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
            className="w-full max-w-2xl rounded-2xl border border-gray-300 bg-white shadow-elegant overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {initial
                    ? t("resourceProvidor.workSites.edit-resource-heading")
                    : t("resourceProvidor.workSites.add-resource-heading")}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isOther && !initial
                    ? t(
                        "resourceProvidor.workSites.resource.no-matching-category",
                      )
                    : t("resourceProvidor.workSites.resource.provide-details")}
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
              className="space-y-5 p-6 overflow-auto max-h-130 relative"
              style={{ scrollbarWidth: "none" }}
            >
              {/* resource name */}
              <div className="flex gap-4">
                {/* resource name & resource image  */}
                <Input
                  label={t("resourceProvidor.workSites.resource.label-name")}
                  id="name"
                  placeholder={t(
                    "resourceProvidor.workSites.resource.placeholder-name",
                  )}
                  fieldName="name"
                  errors={errors}
                  {...register("name")}
                />
              </div>

              <ImageUploader
                required={true}
                fileName={"image"}
                value={image}
                onFileChange={handleImageChange}
                errors={errors ?? null}
                fieldName="image"
              />

              {/* resource description  */}
              <div className="space-y-4">
                <Label htmlFor="desc">
                  {t("resourceProvidor.workSites.resource.label-description")}
                </Label>
                <Textarea
                  id="desc"
                  placeholder={t(
                    "resourceProvidor.workSites.resource.placeholder-description",
                  )}
                  rows={3}
                  {...register("description")}
                />
              </div>

              {/* unit price & quanitty & unit type  */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("resourceProvidor.workSites.resource.label-unit-type")}
                  </Label>
                  <Select
                    value={unitType}
                    setValue={(v) => setValue("unitType", v as UnitType)}
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
                  id="pricePerUnit"
                  type="number"
                  min={0}
                  step="0.01"
                  fieldName="pricePerUnit"
                  errors={errors}
                  {...register("pricePerUnit")}
                />
                <Input
                  label={t(
                    "resourceProvidor.workSites.resource.label-quantity",
                  )}
                  id="quantity"
                  type="number"
                  min={0}
                  fieldName="quantity"
                  errors={errors}
                  {...register("quantity")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("resourceProvidor.workSites.resource.label-category")}
                  </Label>
                  <Select
                    value={category}
                    setValue={(v) => setValue("category", v)}
                  >
                    {initialCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value={OTHER}>Other</option>
                  </Select>
                </div>
                {isOther && (
                  <Input
                    label={t(
                      "resourceProvidor.workSites.resource.placeholder-proposed-category",
                    )}
                    id="customCategory"
                    required={true}
                    placeholder={t(
                      "resourceProvidor.workSites.resource.placeholder-proposed-category",
                    )}
                    fieldName="customCategory"
                    errors={errors}
                    {...register("customCategory")}
                  />
                )}
                {!(isOther && !initial) && (
                  <div className="space-y-2">
                    <Label>
                      {t(
                        "resourceProvidor.workSites.resource.label-availability",
                      )}
                    </Label>
                    <Select
                      value={availability}
                      setValue={(v) =>
                        setValue("availability", v as ResourceAvailability)
                      }
                    >
                      {availabilities.map((a) => (
                        <option key={a} value={a}>
                          {t(
                            `resourceProvidor.workSites.resource.availability.${a}`,
                          )}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>

              {/* Order rqeuset note  */}
              {isOther && !initial && (
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-foreground/80">
                  {t(
                    "resourceProvidor.workSites.resource.order-request-note-part1",
                  )}
                  <span className="font-semibold">
                    {t(
                      "resourceProvidor.workSites.resource.order-request-note-strong",
                    )}
                  </span>
                  {t(
                    "resourceProvidor.workSites.resource.order-request-note-part2",
                  )}
                </div>
              )}

              {/* Controlers buttons  */}
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
                <Button
                  type="submit"
                  disabled={isCreated || isUpdated || isRequested}
                >
                  {isCreated || isUpdated || isRequested
                    ? t("common.loading", "Saving...")
                    : initial
                      ? t("resourceProvidor.workSites.btn-save")
                      : t("resourceProvidor.workSites.resource.btn-create")}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Model.Window>
    </Model>
  );
}
