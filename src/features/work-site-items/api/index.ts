const BASE_WORKSITE_ROUTE = "worksite";

export enum WorkSiteItemsController {
  AddResources = `${BASE_WORKSITE_ROUTE}/add-resources`,
  AddServices = `${BASE_WORKSITE_ROUTE}/add-services`,
  WorkSiteResourcesStatistics = `${BASE_WORKSITE_ROUTE}/order-statistic`,
  UpdateWorkSite = `${BASE_WORKSITE_ROUTE}/update-resource`,
  DelelteResource = `${BASE_WORKSITE_ROUTE}/delete-item`,
  WorkSiteResources = `${BASE_WORKSITE_ROUTE}/get-resource`,
  WorkSiteServices = `${BASE_WORKSITE_ROUTE}/get-services`,
}

export const QUERY_KEYS = {
  resource: (id: any) => ["Providor", "workSite", "items", id],
  resources: ["Providor", "workSite", "resources"],
  services: ["Providor", "workSite", "services"],
  statistics: ["Providor", "items", "statistics"],
  deltee: ["Providor", "items", "delete"],
};

export const MUTATION_KEYS = {
  resource: {
    create: () => ["resourceProvidor", "workSites", "items", "create"],
    update: () => ["resourceProvidor", "workSites", "items", "update"],
    delete: () => ["resourceProvidor", "workSite", "items", "delete"],
  },
};
