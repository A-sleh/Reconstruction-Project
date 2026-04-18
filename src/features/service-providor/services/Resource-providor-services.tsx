import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";

type CompanyInfo = {
  companyTitle: string;
  companyLocation: string;
  companyAddress: string;
  companyDescription: string;
  resourceOverview: string;
};

type ResourceItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  description: string;
};

const ResourceProvidorServices = () => {
  const { t } = useTranslation();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyTitle: "Al Amal Construction",
    companyLocation: "Riyadh, Saudi Arabia",
    companyAddress: "Al Olaya St, Riyadh",
    companyDescription: "A trusted resource provider delivering construction materials and support services.",
    resourceOverview: "We supply building materials, tools, and technical support for reconstruction projects.",
  });

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: "r1",
      name: "Concrete Blocks",
      category: "Building Materials",
      unit: "sqm",
      price: "25",
      description: "High-strength blocks for structural walls.",
    },
    {
      id: "r2",
      name: "Steel Rebars",
      category: "Reinforcement",
      unit: "meter",
      price: "15",
      description: "Grade 60 steel bars for foundation and columns.",
    },
  ]);

  const [newResource, setNewResource] = useState<Omit<ResourceItem, "id">>({
    name: "",
    category: "",
    unit: "",
    price: "",
    description: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleCompanyChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResourceChange = (
    id: string,
    field: keyof Omit<ResourceItem, "id">,
    value: string
  ) => {
    setResources((current) =>
      current.map((resource) =>
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    );
  };

  const handleNewResourceChange = (
    field: keyof Omit<ResourceItem, "id">,
    value: string
  ) => {
    setNewResource((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addResource = () => {
    if (!newResource.name.trim()) {
      setMessage(t("serviceProvider.services.validation.resourceNameRequired"));
      return;
    }

    setResources((current) => [
      ...current,
      {
        id: `resource-${Date.now()}`,
        ...newResource,
      },
    ]);
    setNewResource({ name: "", category: "", unit: "", price: "", description: "" });
    setMessage(t("serviceProvider.services.resourceAddedMessage"));
  };

  const removeResource = (id: string) => {
    setResources((current) => current.filter((resource) => resource.id !== id));
    setMessage(t("serviceProvider.services.resourceRemovedMessage"));
  };

  const saveCompanyInfo = () => {
    setMessage(t("serviceProvider.services.companyUpdatedMessage"));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {t("serviceProvider.services.sectionTitle")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {t("serviceProvider.services.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {t("serviceProvider.services.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <FiMapPin className="h-5 w-5 text-slate-400" />
            <span>{t("serviceProvider.services.subtitle")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); saveCompanyInfo(); }} className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {t("serviceProvider.services.companyInfoTitle")}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {t("serviceProvider.services.companyInfoSubtitle")}
              </p>
            </div>
            <Button type="submit">{t("serviceProvider.services.saveCompanyButton")}</Button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Input
              label={t("serviceProvider.services.companyTitleLabel")}
              placeholder={t("serviceProvider.services.companyTitlePlaceholder")}
              value={companyInfo.companyTitle}
              setValue={(value) => handleCompanyChange("companyTitle", value)}
              required
            />
            <Input
              label={t("serviceProvider.services.locationLabel")}
              placeholder={t("serviceProvider.services.locationPlaceholder")}
              value={companyInfo.companyLocation}
              setValue={(value) => handleCompanyChange("companyLocation", value)}
              iconType="user"
              required
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Input
              label={t("serviceProvider.services.addressLabel")}
              placeholder={t("serviceProvider.services.addressPlaceholder")}
              value={companyInfo.companyAddress}
              setValue={(value) => handleCompanyChange("companyAddress", value)}
              required
            />
            <Input
              label={t("serviceProvider.services.resourceOverviewLabel")}
              placeholder={t("serviceProvider.services.resourceOverviewPlaceholder")}
              value={companyInfo.resourceOverview}
              setValue={(value) => handleCompanyChange("resourceOverview", value)}
            />
          </div>

          <Input
            label={t("serviceProvider.services.descriptionLabel")}
            placeholder={t("serviceProvider.services.descriptionPlaceholder")}
            value={companyInfo.companyDescription}
            setValue={(value) => handleCompanyChange("companyDescription", value)}
            className="col-span-full"
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-950">
              {t("serviceProvider.services.manageResourcesTitle")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t("serviceProvider.services.manageResourcesSubtitle")}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Input
              label={t("serviceProvider.services.resourceNameLabel")}
              placeholder={t("serviceProvider.services.resourceNamePlaceholder")}
              value={newResource.name}
              setValue={(value) => handleNewResourceChange("name", value)}
              required
            />
            <Input
              label={t("serviceProvider.services.resourceCategoryLabel")}
              placeholder={t("serviceProvider.services.resourceCategoryPlaceholder")}
              value={newResource.category}
              setValue={(value) => handleNewResourceChange("category", value)}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Input
              label={t("serviceProvider.services.resourceUnitLabel")}
              placeholder={t("serviceProvider.services.resourceUnitPlaceholder")}
              value={newResource.unit}
              setValue={(value) => handleNewResourceChange("unit", value)}
            />
            <Input
              label={t("serviceProvider.services.resourcePriceLabel")}
              placeholder={t("serviceProvider.services.resourcePricePlaceholder")}
              value={newResource.price}
              setValue={(value) => handleNewResourceChange("price", value)}
            />
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={addResource} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t("serviceProvider.services.addResourceButton")}
                </span>
              </Button>
            </div>
          </div>

          <Input
            label={t("serviceProvider.services.resourceDescriptionLabel")}
            placeholder={t("serviceProvider.services.resourceDescriptionPlaceholder")}
            value={newResource.description}
            setValue={(value) => handleNewResourceChange("description", value)}
            className="col-span-full"
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {t("serviceProvider.services.currentResourcesTitle")}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {t("serviceProvider.services.currentResourcesSubtitle")}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {resources.length} {t("serviceProvider.services.resourcesCount")}
            </div>
          </div>

          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={t("serviceProvider.services.resourceNameLabel")}
                      value={resource.name}
                      setValue={(value) => handleResourceChange(resource.id, "name", value)}
                      placeholder={t("serviceProvider.services.resourceNamePlaceholder")}
                    />
                    <Input
                      label={t("serviceProvider.services.resourceCategoryLabel")}
                      value={resource.category}
                      setValue={(value) => handleResourceChange(resource.id, "category", value)}
                      placeholder={t("serviceProvider.services.resourceCategoryPlaceholder")}
                    />
                    <Input
                      label={t("serviceProvider.services.resourceUnitLabel")}
                      value={resource.unit}
                      setValue={(value) => handleResourceChange(resource.id, "unit", value)}
                      placeholder={t("serviceProvider.services.resourceUnitPlaceholder")}
                    />
                    <Input
                      label={t("serviceProvider.services.resourcePriceLabel")}
                      value={resource.price}
                      setValue={(value) => handleResourceChange(resource.id, "price", value)}
                      placeholder={t("serviceProvider.services.resourcePricePlaceholder")}
                    />
                  </div>

                  <div className="flex items-start justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="inline-flex items-center gap-2"
                      onClick={() => removeResource(resource.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                      {t("serviceProvider.services.removeResourceButton")}
                    </Button>
                  </div>
                </div>

                <Input
                  label={t("serviceProvider.services.resourceDescriptionLabel")}
                  value={resource.description}
                  setValue={(value) => handleResourceChange(resource.id, "description", value)}
                  placeholder={t("serviceProvider.services.resourceDescriptionPlaceholder")}
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        </section>
      </form>

      {message && (
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </div>
      )}
    </div>
  );
};

export default ResourceProvidorServices;
