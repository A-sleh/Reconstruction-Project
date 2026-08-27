const BASE_BANK_ITEM_ROUTE = "bank-item";
const BASE_BANK_ROUTE = "bank";

export enum BankItemController {
  GetAllRequests = `${BASE_BANK_ITEM_ROUTE}/get-requests`,
  GetAllRequestsOfCurrentUser = `${BASE_BANK_ITEM_ROUTE}/get-user-requests`,
  ResolveRequest = `${BASE_BANK_ITEM_ROUTE}/resolve-request`,
  RejectRequest = `${BASE_BANK_ITEM_ROUTE}/reject-request`,
  ApproveRequest = `${BASE_BANK_ITEM_ROUTE}/approve-request`,
  AddRequest = `${BASE_BANK_ITEM_ROUTE}/add-request`,

  // Bank Categories & Resources
  BankCategories = `${BASE_BANK_ROUTE}/get-bank-categories`,
  CreateCategory = `category/create`,
  UpdateCategory = `category/update`,
  DeleteCategory = `category/delete`,
  Resources = `${BASE_BANK_ROUTE}/get-resources`,
  Services = `${BASE_BANK_ROUTE}/get-services`,
  BankStat = `${BASE_BANK_ROUTE}/get-statistics`,

  // Tags
  ResourceTags = `${BASE_BANK_ROUTE}/get-resource-tags`,
  ServiceTags = `${BASE_BANK_ROUTE}/get-service-tags`,
  AddResourceTags = `${BASE_BANK_ROUTE}/add-resource-tags`,
  AddServiceTags = `${BASE_BANK_ROUTE}/add-service-tags`,
  RemoveResourceTags = `${BASE_BANK_ROUTE}/remove-resource-tags`,
  RemoveServiceTags = `${BASE_BANK_ROUTE}/remove-service-tags`,

  // Bank Item CRUD
  AddService = `${BASE_BANK_ROUTE}/create-service-bank`,
  UpdateService = `${BASE_BANK_ROUTE}/update-service-bank`,
  DeleteService = `${BASE_BANK_ROUTE}/delete-service-bank`,
  AddResource = `${BASE_BANK_ROUTE}/create-resource-bank`,
  UpdateResource = `${BASE_BANK_ROUTE}/update-resource-bank`,
  DeleteResource = `${BASE_BANK_ROUTE}/delete-resource-bank`,
}

export const QUERY_KEYS = {
  bankItems: {
    all: ["bankItems"] as const,
    user: ["user-bankItems"] as const,
    lists: () => [...QUERY_KEYS.bankItems.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...QUERY_KEYS.bankItems.lists(), filters] as const,
  },
  // Bank Categories & Resources
  resources: ["categoryBank", "resources"] as const,
  services: ["categoryBank", "services"] as const,
  bankCategories: ["categoryBank", "bank-categories"] as const,
  bankStat: ["categoryBank", "stat"] as const,
  resourceTags: (search: string) =>
    ["categoryBank", "resource-tags", search] as const,
  serviceTags: (search: string) =>
    ["categoryBank", "service-tags", search] as const,
};

export const MUTATION_KEYS = {
  bankItems: {
    resolve: () => ["bankItems", "resolve"],
    reject: () => ["bankItems", "reject"],
    approve: () => ["bankItems", "approve"],
    cancel: () => ["bankItems", "cancel"],
    add: () => ["bankItems", "add"],
  },
  category: {
    create: () => ["categoryBank", "category", "create"],
    update: () => ["categoryBank", "category", "update"],
    delete: () => ["categoryBank", "category", "delete"],
  },
  tags: {
    addResource: () => ["categoryBank", "tags", "add-resource"],
    addService: () => ["categoryBank", "tags", "add-service"],
    removeResource: () => ["categoryBank", "tags", "remove-resource"],
    removeService: () => ["categoryBank", "tags", "remove-service"],
  },
  bankItem: {
    createService: () => ["categoryBank", "bankItem", "create-service"],
    updateService: () => ["categoryBank", "bankItem", "update-service"],
    deleteService: () => ["categoryBank", "bankItem", "delete-service"],
    createResource: () => ["categoryBank", "bankItem", "create-resource"],
    updateResource: () => ["categoryBank", "bankItem", "update-resource"],
    deleteResource: () => ["categoryBank", "bankItem", "delete-resource"],
  },
};
