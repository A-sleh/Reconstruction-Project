import { useMemo } from "react";

import type { WorkShopsTotals } from "@/features/work-shop/api/types";
import { useWorkShops } from "@/features/work-shop/api/queries";
import type { ProjectStatistics } from "../../api/types";
import {
  MOCK_CASH_FLOW,
  MOCK_CATEGORY_SHARES,
  MOCK_SAMPLE_TRANSACTIONS,
} from "../mockData";
import type {
  CashFlowPoint,
  CategoryShareItem,
  ProjectFinancialSummary,
  ProjectTransaction,
  TransactionStatus,
  WorkshopBudgetItem,
} from "./types";

export interface ProjectFinancialData {
  summary: ProjectFinancialSummary;
  workshopBudgets: WorkshopBudgetItem[];
  ledger: ProjectTransaction[];
  cashFlow: CashFlowPoint[];
  categoryShares: CategoryShareItem[];
  workshopTotals?: WorkShopsTotals;
  isLoading: boolean;
  isError: boolean;
}

export const useProjectFinancials = ({
  projectId,
  statistics,
}: {
  projectId: number;
  statistics?: ProjectStatistics;
}): ProjectFinancialData => {
  const workshopsQuery = useWorkShops({
    ProjectId: projectId,
    PageSize: 100,
  });

  return useMemo<ProjectFinancialData>(() => {
    const workshops = workshopsQuery.data?.list ?? [];
    const workshopTotals = workshopsQuery.data?.totals;

    const summary: ProjectFinancialSummary = {
      totalPayments: statistics?.totalPayments ?? 0,
      totalPaid: statistics?.totalPaid ?? 0,
      remainingPayments: statistics?.remainingPayments ?? 0,
      totalOrders: statistics?.totalOrders ?? 0,
      totalWorkshops: statistics?.totalWorkshops ?? 0,
      totalWorkshopBudget: workshopTotals?.totalCost ?? 0,
      totalWorkshopPaid: workshopTotals?.totalPaid ?? 0,
      totalWorkshopRemaining: workshopTotals?.totalRemaining ?? 0,
      budgetUtilization:
        workshopTotals && workshopTotals.totalCost > 0
          ? Math.round(
              (workshopTotals.totalPaid / workshopTotals.totalCost) * 100,
            )
          : 0,
    };

    const workshopBudgets: WorkshopBudgetItem[] = workshops.map((ws) => ({
      workshopId: ws.id,
      workshopName: ws.name,
      status: ws.status,
      paid: ws.costPaid,
      required: ws.totalCost,
      remaining: ws.remaining,
    }));

    const workshopLedgerRows: ProjectTransaction[] = workshops.map((ws) => {
      const status: TransactionStatus = ws.remaining > 0 ? "pending" : "paid";
      return {
        id: `ws-${ws.id}`,
        date: ws.startWorkDate,
        counterParty: ws.name,
        category: "workshop",
        direction: "expense",
        amount: ws.costPaid,
        status,
        source: "live",
        referenceId: ws.id,
      };
    });

    const ledger = [...workshopLedgerRows, ...MOCK_SAMPLE_TRANSACTIONS];

    const scale = Math.max(summary.remainingPayments, summary.totalPaid, 0) || 1;

    const cashFlow: CashFlowPoint[] = MOCK_CASH_FLOW.map((point) => ({
      month: point.month,
      income: Math.round(point.income * scale),
      expense: Math.round(point.expense * scale),
    }));

    const categoryShares: CategoryShareItem[] = MOCK_CATEGORY_SHARES.map(
      (share) => ({
        category: share.category,
        value: Math.round(share.value * scale),
      }),
    );

    return {
      summary,
      workshopBudgets,
      ledger,
      cashFlow,
      categoryShares,
      workshopTotals,
      isLoading: workshopsQuery.isLoading,
      isError: workshopsQuery.isError,
    };
  }, [
    workshopsQuery.data,
    statistics,
    workshopsQuery.isLoading,
    workshopsQuery.isError,
  ]);
};