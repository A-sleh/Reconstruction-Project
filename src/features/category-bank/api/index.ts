const BASE_BANK_ITEM_ROUTE = "bank-item";

export enum BankItemController {
  GetAllRequests = `${BASE_BANK_ITEM_ROUTE}`, // Maps to your GET endpoint
  ResolveRequest = `${BASE_BANK_ITEM_ROUTE}/resolve-request`,
  RejectRequest = `${BASE_BANK_ITEM_ROUTE}/reject-request`,
  ApproveRequest = `${BASE_BANK_ITEM_ROUTE}/approve-request`,
  AddRequest = `${BASE_BANK_ITEM_ROUTE}/add-request`,
}

export const QUERY_KEYS = {
  // ... your existing orders keys
  bankItems: {
    all: ["bankItems"] as const,
    lists: () => [...QUERY_KEYS.bankItems.all, "list"] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.bankItems.lists(), filters] as const,
  },
};

export const MUTATION_KEYS = {
  // ... your existing orders keys
  bankItems: {
    resolve: () => ["bankItems", "resolve"],
    reject: () => ["bankItems", "reject"],
    approve: () => ["bankItems", "approve"],
    add: () => ["bankItems", "add"],
  },
};