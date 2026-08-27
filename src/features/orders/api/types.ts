import { Paginated } from "@/types";

// ============================================================================
// 1. Shared Types & Enums
// ============================================================================
export type OrderStatus =
  | "PendingApproval"
  | "Preparing"
  | "Cancelled"
  | "PendingToApproveCancellation"
  | "Suspended"
  | "Completed";
  
export type OrderItemStatus =
  | "PendingApproval"
  | "Preparing"
  | "CancelledByClient"
  | "CancelledByProvider"
  | "PendingToApproveCancellation"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export const ORDER_STATUSES: OrderStatus[] = [
  "PendingApproval",
  "Preparing",
  "Cancelled",
  "Suspended",
  "Completed",
];

// ============================================================================
// 2. Core Entities (Main Models)
// ============================================================================
export interface Order {
  id: number;
  ownerId: number;
  ownerName: string;
  totalPrice: number;
  totalDiscountValue: number;
  netTotal: number;
  fulfillRate: number;
  requestedAt: string;
  updatedAt: string;
  status: OrderStatus; // Consider changing this to RequestStatus if applicable!
}

export interface OrderDetails extends Order {
  items: OrderItem[];
  orderReceiveInvoices: OrderReceiveInvoice[];
  orderPayments: OrderPayment[];
}

// ============================================================================
// 3. Child & Sub-Entities (Nested Relationships)
// ============================================================================
export interface OrderItem {
  itemId: number;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  fulfilledQuantity: number;
  fulfillRate: number;
  totalAmount: number;
  latestUpdateAt: string;
  itemStatus: OrderItemStatus;
}

export interface OrderReceiveInvoice {
  receiveDate: string;
  isApprovedByCustomer: boolean;
  receiveInvoiceItems: ReceiveInvoiceItem[];
}

export interface ReceiveInvoiceItem {
  name: string;
  category: string;
  quantity: number;
}

export interface OrderPayment {
  amount: number;
  paymentDate: string;
}

// ============================================================================
// 4. API Response Wrappers
// ============================================================================
export interface OrdersResponse extends Paginated<Order> {}

export interface OrderDetailsResponse {
  orderDetails: OrderDetails;
}

export interface OrderItemsResponse {
  orderItems: OrderItem[];
}

// ============================================================================
// GET /api/order/get-by-id
// ============================================================================
export interface OrderByIdParams {
  OrderId: number; // integer ($int64)
}

// ============================================================================
// GET /api/order/get-status-statistics
// ============================================================================
export interface GetOrderStatusStatisticsParams {
  WorkSiteId: number; // integer ($int64)
}

export interface OrderStatusStatistic {
  status: OrderStatus;
  count: number;
}

export interface OrderStatusStatisticsResponse {
  data: OrderStatusStatistic[];
}

// ============================================================================
// GET /api/order/get-all
// ============================================================================
export interface GetOrderAllFilters {
  WorkSiteId?: number; // integer ($int64)
  From?: Date; // string ($date-time)
  To?: Date; // string ($date-time)
  Status?: OrderStatus; // string (Union literal helper above)
  SearchByOwner?: string; // string
  PageNumber?: number; // integer ($int32)
  PageSize?: number; // integer ($int32)
}

// ============================================================================
// POST /api/order/add-payment
// ============================================================================
export interface AddPaymentRequestBody {
  orderId: number;
  amount: number;
  paymentDate: string | Date; // Expects an ISO date-time string
}

// ============================================================================
// POST /api/order/add-receive-invoice
// ============================================================================
export interface OrderItemReceive {
  orderItemId: number;
  quantity: number;
}

export interface AddReceiveInvoiceRequestBody {
  receivedDate: string | Date; // Expects an ISO date-time string
  orderItemReceives: OrderItemReceive[];
}


// ============================================================================
// POST /api/order/approve-order-item-cancellation
// ============================================================================
export interface ApproveOrderItemCancellationRequestBody {
  orderItemId: number;
  note: string;
}

// ============================================================================
// POST /api/order/mark-as-received
// ============================================================================
export interface MarkAsReceivedRequestBody {
  orderId: number;
  receiveDate: string | Date; // Expects an ISO date-time string
}

// ============================================================================
// POST /api/order/cancel-order
// ============================================================================
export interface CancelOrderRequestBody {
  orderId: number;
  note: string;
}

// ============================================================================
// POST /api/order/cancel-order-item
// ============================================================================
export interface CancelOrderItemRequestBody {
  orderItemId: number;
  note: string;
}

// ============================================================================
// POST /api/order/approve-order-cancellation
// ============================================================================
export interface ApproveOrderCancellationRequestBody {
  orderId: number;
  note: string;
}

// ============================================================================
// POST /api/order/create-service-order
// ============================================================================
export interface CreateServiceOrderItem {
  serviceId: number; // integer ($int64)
  quantity: number; // integer ($int32)
  discountDetailId: number; // integer ($int64)
}

export interface CreateServiceOrderRequestBody {
  projectId: number; // integer ($int64)
  discountDetailId: number; // integer ($int64)
  items: CreateServiceOrderItem[];
}

// ============================================================================
// POST /api/order/create-resource-order
// ============================================================================
export interface CreateResourceOrderItem {
  resourceId: number; // integer ($int64)
  quantity: number; // integer ($int32)
  discountDetailId: number; // integer ($int64)
}

export interface CreateResourceOrderRequestBody {
  projectId: number; // integer ($int64)
  discountDetailId: number; // integer ($int64)
  items: CreateResourceOrderItem[];
}