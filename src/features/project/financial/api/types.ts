export const TRANSACTION_CATEGORIES = [
  "workshop",
  "provider-resource",
  "provider-service",
  "engineer",
  "other",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export type TransactionDirection = "income" | "expense";

export const TRANSACTION_STATUSES = ["paid", "pending", "overdue"] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export type TransactionSource = "live" | "sample";

export interface ProjectTransaction {
  id: string;
  date: string;
  counterParty: string;
  category: TransactionCategory;
  direction: TransactionDirection;
  amount: number;
  status: TransactionStatus;
  source: TransactionSource;
  referenceId?: number;
}

export interface ProjectFinancialSummary {
  totalPayments: number;
  totalPaid: number;
  remainingPayments: number;
  totalOrders: number;
  totalWorkshops: number;
  totalWorkshopBudget: number;
  totalWorkshopPaid: number;
  totalWorkshopRemaining: number;
  budgetUtilization: number;
}

export interface WorkshopBudgetItem {
  workshopId: number;
  workshopName: string;
  status: string;
  paid: number;
  required: number;
  remaining: number;
}

export interface CashFlowPoint {
  month: number;
  income: number;
  expense: number;
}

export interface CategoryShareItem {
  category: TransactionCategory;
  value: number;
}