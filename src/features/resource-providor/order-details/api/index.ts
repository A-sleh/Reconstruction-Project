export enum InvestorRequestDetailsController {
  InvestorRequestDetails = "investo-request",
  InvestorRequestOrders = "investo-request/orders",
}

export const QUERY_KEYS = {
  investorReqeust: (id: string | number) => [
    "resourceProvidor",
    "investor",
    "requests",
    id,
  ],
};

export const MUTATION_KEYS = {
  investorRequestDetails: {
    approve: () => ["resourceProvidor", "investor", "requests", "approve"],
    cancel: () => ["resourceProvidor", "investor", "requests", "cancel"],
    fullyDelivered: () => ["resourceProvidor", "investor", "requests", "fully-delivered"],
    createInvoice: () => ["resourceProvidor", "investor", "requests", "new-invoice"],
    updateQuantity: () => ["resourceProvidor", "investor", "requests", "update-quantity"],
  },
};
