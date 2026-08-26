import { GetAllWorkShopsFilters } from "./types";

const BASE_WORK_SHOP_ROUTE = "work-shop";

export enum WorkShopController {
  GetAll = `${BASE_WORK_SHOP_ROUTE}/get-all`,
  Create = `${BASE_WORK_SHOP_ROUTE}/create`,
  Update = `${BASE_WORK_SHOP_ROUTE}/update`,
  Delete = `${BASE_WORK_SHOP_ROUTE}/delete`,
  GetInvoices = `${BASE_WORK_SHOP_ROUTE}/get-invoices`,
  AddInvoice = `${BASE_WORK_SHOP_ROUTE}/add-invoice`,
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
    addInvoice: () => ["workShops", "addInvoice"],
  },
};
