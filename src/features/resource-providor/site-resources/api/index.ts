import { BankItemController } from "@/features/category-bank/api";

// Re-export moved query keys from category-bank
export { QUERY_KEYS as BankCategoryQueryKeys } from "@/features/category-bank/api";

export enum WorkSiteResourcesController_Legacy {
  AddResources = "worksite/add-resources",
  WorkSiteResourcesStatistics = "worksite/order-statistic",
  updateWorkSite = "worksite/update-resource",
  delelteResource = "worksite/delete-item",
  WorkSiteResources = `worksite/get-resource`,
  OrderRequest = "orders",
}

// Merged controller for backward compatibility
export const WorkSiteResourcesController = {
  ...WorkSiteResourcesController_Legacy,
  BankCategories: BankItemController.BankCategories,
  Resources: BankItemController.Resources,
  WorkSiteResources: BankItemController.WorkSiteResources,
};

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
