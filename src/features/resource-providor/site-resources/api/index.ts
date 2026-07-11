export enum WorkSiteResourcesController {
  BankCategories = "bank/get-bank-categories",
  Resources = "bank/get-resources",
  WorkSiteResources = "worksite/get-resource",
  AddResources = "worksite/add-resources",
  WorkSiteResourcesStatistics = "worksite/order-statistic",
  updateWorkSite = "worksite/update-resource",
  delelteResource = "worksite/delete-item",
  
  OrderRequest = "orders",
}

export const QUERY_KEYS = {
  resource: (id: any) => ["resourceProvidor", "workSite", "resource", id],
  resources: ["resourceProvidor", "workSite", "resources"],
  bankCategories: ["resourceProvidor", "resorces", "bank-categories"],
  statistics: ["resourceProvidor", "resorces", "statistics"],
  orders: ["resourceProvidor", "resorces", "orders"],
  deltee: ["resourceProvidor", "resorces", "delete"],
};

export const MUTATION_KEYS = {
  resource: {
    create: () => ["resourceProvidor", "workSites", "resource", "create"],
    update: () => ["resourceProvidor", "workSites", "resource", "update"],
    delete: () => ["resourceProvidor", "workSite", "resource", "delete"],
  },
};
