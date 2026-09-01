import type { OrderStatus } from "@/features/orders/api/types";

import type { ProviderDashboardData } from "../api/types";

const STATUS: Record<string, OrderStatus> = {
  pendingApproval: "PendingApproval",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
  suspended: "Suspended",
  pendingToApproveCancellation: "PendingToApproveCancellation",
};

export const MOCK_SERVICE_DASHBOARD: ProviderDashboardData = {
  kind: "Service",
  kpi: {
    totalOrders: 21,
    completedOrders: 13,
    pendingOrders: 3,
    preparingOrders: 3,
    cancelledOrders: 2,
    netSpend: 318_000,
    totalDiscount: 15_000,
    avgFulfillRate: 88,
    totalItems: 96,
    availableItems: 74,
    lowStockItems: 12,
  },
  statusDistribution: [
    { status: STATUS.completed, count: 13 },
    { status: STATUS.preparing, count: 3 },
    { status: STATUS.pendingApproval, count: 3 },
    { status: STATUS.cancelled, count: 2 },
    { status: STATUS.suspended, count: 0 },
    { status: STATUS.pendingToApproveCancellation, count: 0 },
  ],
  categoryBreakdown: [
    { name: "Engineering Supervision", count: 7, value: 142_000 },
    { name: "Labor & Crews", count: 6, value: 88_000 },
    { name: "Equipment Rental", count: 5, value: 61_000 },
    { name: "Safety Compliance", count: 3, value: 27_000 },
  ],
  monthlyTimeline: [
    { month: "2026-02", orders: 2, spend: 32_000 },
    { month: "2026-03", orders: 3, spend: 48_000 },
    { month: "2026-04", orders: 4, spend: 55_000 },
    { month: "2026-05", orders: 4, spend: 62_000 },
    { month: "2026-06", orders: 5, spend: 70_000 },
    { month: "2026-07", orders: 3, spend: 51_000 },
  ],
  topItems: [
    { name: "Structural Supervision", category: "Engineering Supervision", quantity: 7, amount: 86_000 },
    { name: "Site Crew (10 workers)", category: "Labor & Crews", quantity: 6, amount: 64_000 },
    { name: "Concrete Pump Rental", category: "Equipment Rental", quantity: 5, amount: 41_000 },
    { name: "Safety Audit Service", category: "Safety Compliance", quantity: 3, amount: 18_000 },
  ],
  insights: [
    { labelKey: "project.dashboard.insights.avgOrderValue", value: "$15,143", accent: "text-emerald-600" },
    { labelKey: "project.dashboard.insights.topCategory", value: "Engineering Supervision", accent: "text-primary" },
    { labelKey: "project.dashboard.insights.fulfillmentRate", value: "88%", accent: "text-amber-600" },
    { labelKey: "project.dashboard.insights.cancellationRate", value: "10%", accent: "text-indigo-600" },
    { labelKey: "project.dashboard.insights.highestSpendMonth", value: "2026-06", accent: "text-violet-600" },
    { labelKey: "project.dashboard.insights.availableRatio", value: "77%", accent: "text-destructive" },
  ],
};

export const MOCK_RESOURCE_DASHBOARD: ProviderDashboardData = {
  kind: "Resource",
  kpi: {
    totalOrders: 28,
    completedOrders: 16,
    pendingOrders: 4,
    preparingOrders: 5,
    cancelledOrders: 3,
    netSpend: 486_000,
    totalDiscount: 24_000,
    avgFulfillRate: 82,
    totalItems: 340,
    availableItems: 265,
    lowStockItems: 48,
  },
  statusDistribution: [
    { status: STATUS.completed, count: 16 },
    { status: STATUS.preparing, count: 5 },
    { status: STATUS.pendingApproval, count: 4 },
    { status: STATUS.cancelled, count: 3 },
    { status: STATUS.suspended, count: 0 },
    { status: STATUS.pendingToApproveCancellation, count: 0 },
  ],
  categoryBreakdown: [
    { name: "Construction Materials", count: 10, value: 196_000 },
    { name: "Finishing Materials", count: 7, value: 122_000 },
    { name: "Heavy Equipment", count: 5, value: 118_000 },
    { name: "Safety Gear", count: 4, value: 32_000 },
    { name: "Plumbing Supplies", count: 2, value: 18_000 },
  ],
  monthlyTimeline: [
    { month: "2026-02", orders: 3, spend: 54_000 },
    { month: "2026-03", orders: 4, spend: 72_000 },
    { month: "2026-04", orders: 5, spend: 81_000 },
    { month: "2026-05", orders: 6, spend: 95_000 },
    { month: "2026-06", orders: 5, spend: 88_000 },
    { month: "2026-07", orders: 5, spend: 96_000 },
  ],
  topItems: [
    { name: "Steel Reinforcement Bars", category: "Construction Materials", quantity: 240, amount: 96_000 },
    { name: "Concrete Mix", category: "Construction Materials", quantity: 180, amount: 62_000 },
    { name: "Ceramic Tiles", category: "Finishing Materials", quantity: 120, amount: 34_000 },
    { name: "Excavator Rental", category: "Heavy Equipment", quantity: 3, amount: 48_000 },
  ],
  insights: [
    { labelKey: "project.dashboard.insights.avgOrderValue", value: "$17,357", accent: "text-emerald-600" },
    { labelKey: "project.dashboard.insights.topCategory", value: "Construction Materials", accent: "text-primary" },
    { labelKey: "project.dashboard.insights.fulfillmentRate", value: "82%", accent: "text-amber-600" },
    { labelKey: "project.dashboard.insights.cancellationRate", value: "11%", accent: "text-indigo-600" },
    { labelKey: "project.dashboard.insights.highestSpendMonth", value: "2026-07", accent: "text-violet-600" },
    { labelKey: "project.dashboard.insights.availableRatio", value: "78%", accent: "text-destructive" },
  ],
};
