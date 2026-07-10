import {
  Order,
  OrderDetails,
  OrderDetailsResponse,
  OrderItem,
  OrderReceiveInvoice,
} from "../api/types";

// Mock Order Items
export const MOCK_ORDER_ITEMS: OrderItem[] = [
  {
    itemId: 1,
    itemName: "Steel Reinforcement Bars",
    category: "Construction Materials",
    quantity: 500,
    unit: "kg",
    price: 12.5,
    fulfilledQuantity: 450,
    fulfillRate: 90,
    totalAmount: 6250,
    latestUpdateAt: "2026-07-04T10:30:00Z",
    itemStatus: "Preparing",
  },
  {
    itemId: 2,
    itemName: "Concrete Mix",
    category: "Construction Materials",
    quantity: 200,
    unit: "m³",
    price: 85.0,
    fulfilledQuantity: 200,
    fulfillRate: 100,
    totalAmount: 17000,
    latestUpdateAt: "2026-07-03T15:20:00Z",
    itemStatus: "Completed",
  },
  {
    itemId: 3,
    itemName: "Ceramic Tiles",
    category: "Finishing Materials",
    quantity: 5000,
    unit: "pcs",
    price: 2.5,
    fulfilledQuantity: 2500,
    fulfillRate: 50,
    totalAmount: 12500,
    latestUpdateAt: "2026-07-02T09:45:00Z",
    itemStatus: "Preparing",
  },
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    ownerId: 101,
    ownerName: "Ahmed Al-Mansouri",
    totalPrice: 35750.0,
    totalDiscountValue: 3575.0,
    netTotal: 32175.0,
    fulfillRate: 80,
    requestedAt: "2026-06-15T08:00:00Z",
    updatedAt: "2026-07-04T14:30:00Z",
    status: "Preparing",
  },
  {
    id: 2,
    ownerId: 102,
    ownerName: "Fatima Al-Zahra",
    totalPrice: 25000.0,
    totalDiscountValue: 1250.0,
    netTotal: 23750.0,
    fulfillRate: 100,
    requestedAt: "2026-06-20T10:30:00Z",
    updatedAt: "2026-07-03T11:15:00Z",
    status: "Completed",
  },
  {
    id: 3,
    ownerId: 103,
    ownerName: "Mohammed Al-Rashid",
    totalPrice: 45600.0,
    totalDiscountValue: 4560.0,
    netTotal: 41040.0,
    fulfillRate: 45,
    requestedAt: "2026-07-01T14:20:00Z",
    updatedAt: "2026-07-04T09:00:00Z",
    status: "PendingApproval",
  },
  {
    id: 4,
    ownerId: 104,
    ownerName: "Layla Al-Otaibi",
    totalPrice: 18900.0,
    totalDiscountValue: 945.0,
    netTotal: 17955.0,
    fulfillRate: 65,
    requestedAt: "2026-06-25T11:45:00Z",
    updatedAt: "2026-07-02T16:30:00Z",
    status: "Preparing",
  },
  {
    id: 5,
    ownerId: 105,
    ownerName: "Samir Al-Dowaish",
    totalPrice: 52300.0,
    totalDiscountValue: 2615.0,
    netTotal: 49685.0,
    fulfillRate: 75,
    requestedAt: "2026-06-10T09:15:00Z",
    updatedAt: "2026-07-04T13:20:00Z",
    status: "Preparing",
  },
  {
    id: 6,
    ownerId: 106,
    ownerName: "Noor Al-Najjar",
    totalPrice: 12400.0,
    totalDiscountValue: 620.0,
    netTotal: 11780.0,
    fulfillRate: 100,
    requestedAt: "2026-06-22T15:40:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
    status: "Completed",
  },
  {
    id: 7,
    ownerId: 107,
    ownerName: "Hassan Al-Harbi",
    totalPrice: 38750.0,
    totalDiscountValue: 3875.0,
    netTotal: 34875.0,
    fulfillRate: 55,
    requestedAt: "2026-07-02T12:30:00Z",
    updatedAt: "2026-07-04T08:45:00Z",
    status: "PendingApproval",
  },
  {
    id: 8,
    ownerId: 108,
    ownerName: "Reem Al-Qurashi",
    totalPrice: 29100.0,
    totalDiscountValue: 1455.0,
    netTotal: 27645.0,
    fulfillRate: 90,
    requestedAt: "2026-06-28T13:20:00Z",
    updatedAt: "2026-07-04T12:10:00Z",
    status: "Preparing",
  },
  {
    id: 9,
    ownerId: 109,
    ownerName: "Omar Al-Shammari",
    totalPrice: 41200.0,
    totalDiscountValue: 2060.0,
    netTotal: 39140.0,
    fulfillRate: 30,
    requestedAt: "2026-07-03T10:00:00Z",
    updatedAt: "2026-07-04T11:30:00Z",
    status: "PendingApproval",
  },
  {
    id: 10,
    ownerId: 110,
    ownerName: "Hana Al-Mutairi",
    totalPrice: 33450.0,
    totalDiscountValue: 1672.5,
    netTotal: 31777.5,
    fulfillRate: 85,
    requestedAt: "2026-06-18T14:15:00Z",
    updatedAt: "2026-07-04T15:00:00Z",
    status: "Preparing",
  },
];

// Mock Order Receive Invoices
export const MOCK_RECEIVE_INVOICES: OrderReceiveInvoice[] = [
  {
    receiveDate: "2026-06-20T09:00:00Z",
    isApprovedByCustomer: true,
    receiveInvoiceItems: [
      { name: "Steel Reinforcement Bars", category: "Construction Materials", quantity: 250 },
      { name: "Concrete Mix", category: "Construction Materials", quantity: 100 },
    ],
  },
  {
    receiveDate: "2026-06-28T14:30:00Z",
    isApprovedByCustomer: true,
    receiveInvoiceItems: [
      { name: "Steel Reinforcement Bars", category: "Construction Materials", quantity: 200 },
    ],
  },
  {
    receiveDate: "2026-07-02T11:15:00Z",
    isApprovedByCustomer: false,
    receiveInvoiceItems: [
      { name: "Ceramic Tiles", category: "Finishing Materials", quantity: 1500 },
      { name: "Concrete Mix", category: "Construction Materials", quantity: 50 },
    ],
  },
  {
    receiveDate: "2026-07-05T08:45:00Z",
    isApprovedByCustomer: false,
    receiveInvoiceItems: [
      { name: "Ceramic Tiles", category: "Finishing Materials", quantity: 1000 },
    ],
  },
];

// Mock Order Details
export const MOCK_ORDER_DETAILS: OrderDetails[] = MOCK_ORDERS.map((order, index) => ({
  ...order,
  items: MOCK_ORDER_ITEMS.slice(0, 2 + (index % 2)),
  orderReceiveInvoices: MOCK_RECEIVE_INVOICES.slice(0, index % 4),
}));

export const MOCK_ORDER_DETAILS_RESPONSE: OrderDetailsResponse = {
  orderDetails: MOCK_ORDER_DETAILS[0],
};

// Generate paginated mock data
export function generateMockOrdersPage(pageNumber: number = 1, pageSize: number = 10) {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = MOCK_ORDERS.slice(startIndex, endIndex);

  return {
    data,
    pageNumber,
    pageSize,
    totalPages: Math.ceil(MOCK_ORDERS.length / pageSize),
    totalRows: MOCK_ORDERS.length,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < Math.ceil(MOCK_ORDERS.length / pageSize),
  };
}
