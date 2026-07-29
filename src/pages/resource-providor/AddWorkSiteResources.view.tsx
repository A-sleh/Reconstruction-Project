import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewResourceForm } from "@/features/work-site-items/components/NewResourceForm";
import {
  Resource,
  useCreateResource,
} from "@/features/work-site-items/api/actions";
import { paths } from "@/config/paths";
import { AddResourcesHeader } from "@/features/work-site-items/components/AddResourcesHeader";
import { AddedResourcesList } from "@/features/work-site-items/components/AddedResourcesList";
import useAuthStore, { User } from "@/stores/useAuthStore";
import { getRolePrefix } from "@/features/work-site-items/components/NewResorceRequestModel";

type LocalResource = Resource & { id: string };

const AddWorkSiteResources = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { siteId = "" } = useParams();
  const navigate = useNavigate();
  const providerRole = useAuthStore((s) => (s.user as User)?.providerRole) ?? "Resource";
  const rolePrefix = getRolePrefix(providerRole);

  const [resources, setResources] = useState<LocalResource[]>([]);
  const [selected, setSelected] = useState<LocalResource | null>(null);

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
    if (!siteId || resources.length === 0) return;

    submitResources(
      { resources, workSiteId: siteId },
      {
        onSuccess: () => {
          navigate(paths.app.resourceProvidor.workSite.getHref(siteId));
        },
      },
    );
  };

  return (
    <section className="p-6 lg:p-8" dir={isArabic ? "rtl" : "ltr"}>
      <AddResourcesHeader
        rolePrefix={rolePrefix}
        hasSelection={!!selected?.id}
        resourceCount={resources.length}
        isSubmitting={isSubmitting}
        onBack={() => navigate(-1)}
        onAddAnother={handleClearSelection}
        onSubmitAll={handleSubmitAll}
      />

      <div className="flex flex-col md:flex-row gap-8">
        <AddedResourcesList
          rolePrefix={rolePrefix}
          resources={resources}
          selectedId={selected?.id ?? null}
          onResourceClick={handleResourceClick}
          onRemove={handleRemoveResource}
        />

        <div className="w-[70%] bg-white p-6 rounded-xl">
          <NewResourceForm
            key={selectedResource?.id ?? "new-resource-form"}
            initial={selectedResource}
            onSubmit={handleResourceSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default AddWorkSiteResources;
