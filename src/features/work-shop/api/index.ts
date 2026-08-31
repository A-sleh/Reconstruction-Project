import { GetAllWorkShopsFilters } from "./types";

const BASE_PROJECT_ROUTE = "project";
const BASE_WORK_SHOP_ROUTE = "work-shop";

export enum WorkShopController {
  GetAll = `${BASE_PROJECT_ROUTE}/get-project-workshops`,
  Create = `${BASE_PROJECT_ROUTE}/add-work-shop`,
  Update = `${BASE_PROJECT_ROUTE}/update-work-shop`,
  Delete = `${BASE_PROJECT_ROUTE}/delete-work-shop`,
  AddPayment = `${BASE_PROJECT_ROUTE}/add-workshop-payment`,
  AddInvoice = `${BASE_PROJECT_ROUTE}/add-workshop-payment`,
  GetInvoices = `${BASE_WORK_SHOP_ROUTE}/get-invoices`,
}

export const QUERY_KEYS = {
  workShops: {
    all: ["workShops"] as const,
    lists: () => [...QUERY_KEYS.workShops.all, "list"] as const,
    list: (filters: GetAllWorkShopsFilters) =>
      [...QUERY_KEYS.workShops.lists(), filters] as const,
    invoices: (workShopId: number) =>
      [...QUERY_KEYS.workShops.all, "invoices", workShopId] as const,
  },
};

export const MUTATION_KEYS = {
  workShops: {
    create: () => ["workShops", "create"],
    update: () => ["workShops", "update"],
    delete: () => ["workShops", "delete"],
    addPayment: () => ["workShops", "addPayment"],
    addInvoice: () => ["workShops", "addInvoice"],
  },
};
