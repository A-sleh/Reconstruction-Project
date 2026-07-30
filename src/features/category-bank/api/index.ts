const BASE_BANK_ITEM_ROUTE = "bank-item";
const BASE_BANK_ROUTE = "bank";

export enum BankItemController {
  GetAllRequests = `${BASE_BANK_ITEM_ROUTE}/get-requests`,
  ResolveRequest = `${BASE_BANK_ITEM_ROUTE}/resolve-request`,
  RejectRequest = `${BASE_BANK_ITEM_ROUTE}/reject-request`,
  ApproveRequest = `${BASE_BANK_ITEM_ROUTE}/approve-request`,
  AddRequest = `${BASE_BANK_ITEM_ROUTE}/add-request`,

  // Bank Categories & Resources
  BankCategories = `${BASE_BANK_ROUTE}/get-bank-categories`,
  CreateCategory = `${BASE_BANK_ROUTE}/category`,
  UpdateCategory = `${BASE_BANK_ROUTE}/category`,
  DeleteCategory = `${BASE_BANK_ROUTE}/category`,
  Resources = `${BASE_BANK_ROUTE}/get-resources`,
  Services = `${BASE_BANK_ROUTE}/get-services`,
  BankStat = `${BASE_BANK_ROUTE}/stat`,

  // Tags
  ResourceTags = `${BASE_BANK_ROUTE}/resources/tags`,
  ServiceTags = `${BASE_BANK_ROUTE}/service/tags`,
  AddResourceTags = `${BASE_BANK_ROUTE}/resources/add-tags`,
  AddServiceTags = `${BASE_BANK_ROUTE}/services/add-tags`,
  RemoveResourceTags = `${BASE_BANK_ROUTE}/resources/remove-tags`,
  RemoveServiceTags = `${BASE_BANK_ROUTE}/services/remove-tags`,

  // Bank Item CRUD
  AddService = `${BASE_BANK_ROUTE}/add-service`,
  UpdateService = `${BASE_BANK_ROUTE}/add-service`,
  DeleteService = `${BASE_BANK_ROUTE}/add-service`,
  AddResource = `${BASE_BANK_ROUTE}/add-resource`,
  UpdateResource = `${BASE_BANK_ROUTE}/add-resource`,
  DeleteResource = `${BASE_BANK_ROUTE}/add-resource`,
}

export const QUERY_KEYS = {
  bankItems: {
    all: ["bankItems"] as const,
    lists: () => [...QUERY_KEYS.bankItems.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...QUERY_KEYS.bankItems.lists(), filters] as const,
  },
  // Bank Categories & Resources
  resources: ["categoryBank", "resources"] as const,
  services: ["categoryBank", "services"] as const,
  bankCategories: ["categoryBank", "bank-categories"] as const,
  bankStat: ["categoryBank", "stat"] as const,
  resourceTags: (search: string) => ["categoryBank", "resource-tags", search] as const,
  serviceTags: (search: string) => ["categoryBank", "service-tags", search] as const,
};

export const MUTATION_KEYS = {
  bankItems: {
    resolve: () => ["bankItems", "resolve"],
    reject: () => ["bankItems", "reject"],
    approve: () => ["bankItems", "approve"],
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
