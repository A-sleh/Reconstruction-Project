import type { OrderStatus } from "@/features/orders/api/types";

export type ProviderType = "Service" | "Resource";

export interface ProviderOrderStat {
  status: OrderStatus;
  count: number;
}

export interface ProviderCategoryStat {
  name: string;
  count: number;
  value: number;
}

export interface ProviderMonthlyStat {
  month: string;
  orders: number;
  spend: number;
}

export interface ProviderTopItem {
  name: string;
  category: string;
  quantity: number;
  amount: number;
}

export interface ProviderInsight {
  labelKey: string;
  value: string;
  accent: string;
}

export interface ProviderDashboardKpi {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  cancelledOrders: number;
  netSpend: number;
  totalDiscount: number;
  avgFulfillRate: number;
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
}

export interface ProviderDashboardData {
  kind: ProviderType;
  kpi: ProviderDashboardKpi;
  statusDistribution: ProviderOrderStat[];
  categoryBreakdown: ProviderCategoryStat[];
  monthlyTimeline: ProviderMonthlyStat[];
  topItems: ProviderTopItem[];
  insights: ProviderInsight[];
}
