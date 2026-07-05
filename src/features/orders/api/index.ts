const BASE_ORDER_ROUTE = "order";

// 1. Fixed the typo from AddReciveInvoice -> AddReceiveInvoice
// 💡 Consider renaming this enum to OrderController if your team permits it!
export enum InvestorRequestController {
  GetAllOrders = `${BASE_ORDER_ROUTE}/get-all`,
  GetOrderById = `${BASE_ORDER_ROUTE}/get-by-id`,
  GetOrderItems = `${BASE_ORDER_ROUTE}/get-items`,
  AcceptOrder = `${BASE_ORDER_ROUTE}/accept`,
  RejectOrder = `${BASE_ORDER_ROUTE}/reject`,
  AddPayment = `${BASE_ORDER_ROUTE}/add-payment`,
  AddReceiveInvoice = `${BASE_ORDER_ROUTE}/add-receive-invoice`,
}

// 2. Query Key Factory Pattern
export const QUERY_KEYS = {
  orders: {
    all: ["orders"] as const,
    lists: () => [...QUERY_KEYS.orders.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...QUERY_KEYS.orders.lists(), filters] as const,
    detail: () => [...QUERY_KEYS.orders.all, "detail"] as const,
    items: () => [...QUERY_KEYS.orders.all, "items"] as const,
    stats: () => [...QUERY_KEYS.orders.all, "stats"] as const,
  },
};

// 3. Structured Mutation Keys
export const MUTATION_KEYS = {
  orders: {
    accept: () => ["orders", "accept"],
    reject: () => ["orders", "reject"],
    addPayment: () => ["orders", "add-payment"],
    addReceiveInvoice: () => ["orders", "add-receive-invoice"],
  },
};
