import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewResourceForm } from "@/features/resource-providor/site-resources/components/NewResourceForm";
import {
  Resource,
  useCreateResource,
} from "@/features/resource-providor/site-resources/api/actions";
import { paths } from "@/config/paths";
import { motion } from "motion/react";

type LocalResource = Resource & { id: string };

const AddWorkSiteResources = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { siteId = "" } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState<LocalResource[]>([]);
  const [selected, setSelected] = useState<LocalResource | null>(null);
  console.log(resources)

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === selected?.id) ?? null,
    [resources, selected],
  );

  const { mutate: submitResources, isPending: isSubmitting } =
    useCreateResource();

  const handleResourceSubmit = (values: Resource) => {
    if (selected) {
      setResources((current) =>
        current.map((resource) =>
          resource.id === selected.id
            ? { ...values, id: selected.id }
            : resource,
        ),
      );
      setSelected(null);
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setResources((current) => [...current, { ...values, id }]);
  };

  const handleResourceClick = (resource: LocalResource) => {
    setSelected(resource);
  };

  const handleRemoveResource = (id: string) => {
    setResources((current) => current.filter((resource) => resource.id !== id));
    if (selected?.id === id) {
      setSelected(null);
    }
  };

  const handleClearSelection = () => {
    setSelected(null);
  };

  const handleSubmitAll = () => {
    if (!siteId || resources.length === 0) {
      return;
    }

    submitResources(
      { resources: resources, workSiteId: siteId },
      {
        onSuccess: () => {
          navigate(paths.app.resourceProvidor.workSite.getHref(siteId));
        },
      },
    );
  };

  return (
    <section className="p-6 lg:p-8" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header  */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-300 gradient-hero text-primary-foreground rounded-lg p-6 flex items-center justify-between gap-3 mb-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {t("resourceProvidor.workSites.add-resource-heading")}
          </h1>
          <p className="text-sm text-white">
            {t("resourceProvidor.workSites.resource.provide-details")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={handleClearSelection}
            disabled={!selected?.id}
          >
            {t(
              "resourceProvidor.workSites.resource.add-another",
              "Add another",
            )}
          </Button>
          <Button
            variant="default"
            className="bg-white text-primary hover:bg-white hover:opacity-75"
            onClick={handleSubmitAll}
            disabled={resources.length === 0 || isSubmitting}
          >
            {isSubmitting
              ? t("common.loading", "Saving...")
              : t("resourceProvidor.workSites.resource.submit-resources", {
                  count: resources.length,
                })}
          </Button>
        </div>
      </motion.header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Added resources  */}
        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm w-[30%] ">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {t("resourceProvidor.workSites.resource.added-resources", {
                  count: resources.length,
                })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "resourceProvidor.workSites.resource.select-to-edit",
                  "Click an item to edit it before submitting.",
                )}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {resources.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-muted-foreground">
                {t(
                  "resourceProvidor.workSites.resource.no-added-resources",
                  "No resources added yet. Use the form to add one.",
                )}
              </div>
            ) : (
              resources.map((resource) => (
                <button
                  key={resource.id}
                  type="button"
                  onClick={() => handleResourceClick(resource)}
                  className={`w-full rounded-xl border p-4 text-left transition-all hover:border-primary ${
                    resource.id === selected?.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white"
                  }`}
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <div className="flex justify-between items-center gap-3 ">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="min-w-0 flex flex-col items-start">
                        <p className="flex flex-col font-semibold truncate items-start">
                          {resource.resourceBank.name}
                          <span className="text-[10px] text-gray-600 p-1 px-2 rounded-full bg-gray-600/20">{resource.resourceBank.category.name}</span>
                        </p>
                        <p className="font-semibold text-gray-500 text-sm w-60 truncate">
                          {resource.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {t(
                            "resourceProvidor.workSites.resource.card.price_per_unit",
                          )}
                          : {resource.price.toFixed(2)} {resource.unit}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveResource(resource.id);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-muted-foreground transition hover:border-destructive hover:text-destructive"
                      aria-label={t(
                        "resourceProvidor.workSites.resource.remove-resource",
                        "Remove",
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="w-[70%] ">
          <NewResourceForm
            key={selectedResource?.id ?? "new-resource-form"}
            initial={selectedResource}
            onSubmit={handleResourceSubmit}
            submitLabel={
              selectedResource
                ? t("resourceProvidor.workSites.btn-save")
                : t("resourceProvidor.workSites.resource.btn-create")
            }
          />
        </div>
      </div>
    </section>
  );
};

export default AddWorkSiteResources;
