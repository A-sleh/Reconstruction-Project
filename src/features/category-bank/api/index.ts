const BASE_BANK_ITEM_ROUTE = "bank-item";
const BASE_BANK_ROUTE = "bank";
const BASE_WORKSITE_ROUTE = "worksite";

export enum BankItemController {
  GetAllRequests = `${BASE_BANK_ITEM_ROUTE}/get-requests`,
  ResolveRequest = `${BASE_BANK_ITEM_ROUTE}/resolve-request`,
  RejectRequest = `${BASE_BANK_ITEM_ROUTE}/reject-request`,
  ApproveRequest = `${BASE_BANK_ITEM_ROUTE}/approve-request`,
  AddRequest = `${BASE_BANK_ITEM_ROUTE}/add-request`,

  // Bank Categories & Resources
  BankCategories = `${BASE_BANK_ROUTE}/get-bank-categories`,
  Resources = `${BASE_BANK_ROUTE}/get-resources`,
  Services = `${BASE_BANK_ROUTE}/get-services`,
  WorkSiteResources = `${BASE_WORKSITE_ROUTE}/get-resource`,
}

export const QUERY_KEYS = {
  bankItems: {
    all: ["bankItems"] as const,
    lists: () => [...QUERY_KEYS.bankItems.all, "list"] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.bankItems.lists(), filters] as const,
  },
  // Bank Categories & Resources
  resources: ["categoryBank", "resources"] as const,
  services: ["categoryBank", "services"] as const,
  bankCategories: ["categoryBank", "bank-categories"] as const,
};

export const MUTATION_KEYS = {
  bankItems: {
    resolve: () => ["bankItems", "resolve"],
    reject: () => ["bankItems", "reject"],
    approve: () => ["bankItems", "approve"],
    add: () => ["bankItems", "add"],
  },
};