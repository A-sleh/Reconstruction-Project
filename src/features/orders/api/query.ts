import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { InvestorRequestController } from ".";
import { QUERY_KEYS } from "."; // Import from your keys file
import {
  GetOrderAllFilters,
  GetOrderStatusStatisticsParams,
  OrderByIdParams,
  OrderDetailsResponse,
  OrderItemsResponse,
  OrderStatusStatisticsResponse,
  OrdersResponse,
} from "./types";

// ==========================================
// 1. API Fetchers
// ==========================================

const getAllOrders = async (filters: GetOrderAllFilters) => {
  const { data } = await ApiInstance.get<OrdersResponse>(
    `/${InvestorRequestController.GetAllOrders}`,
    {
      params: { ...filters },
    }
  );
  return data;
};

const getOrderItems = async ({ OrderId }: OrderByIdParams) => {
  const { data } = await ApiInstance.get<OrderItemsResponse>(
    `/${InvestorRequestController.GetOrderItems}`,
    {
      params: { orderId: OrderId },
    }
  );
  return data;
};

const getOrderDetails = async ({ OrderId }: OrderByIdParams) => {
  const { data } = await ApiInstance.get<OrderDetailsResponse>(
    `/${InvestorRequestController.GetOrderById}`,
    {
      params: { orderId: OrderId },
    }
  );
  return data;
};

const getOrderStatusStatistics = async ({
  WorkSiteId,
}: GetOrderStatusStatisticsParams) => {
  const { data } = await ApiInstance.get<OrderStatusStatisticsResponse>(
    `/${InvestorRequestController.GetStatusStatistics}`,
    {
      params: { WorkSiteId },
    }
  );
  return data;
};

// ==========================================
// 2. Custom Query Hooks
// ==========================================

/**
 * 1. Infinite Query for Fetching Paginated Orders
 * Assumes OrdersResponse includes fields like `hasNextPage` and `pageNum` (or adjust to match your actual API response metadata)
 */
export const useOrdersInfinite = (
  filters: Omit<GetOrderAllFilters, "PageNumber" | "PageSize"> & { PageSize?: number }
) => {
  return useInfiniteQuery<OrdersResponse, Error>({
    // Leverages your factory pattern: QUERY_KEYS.orders.list(filters)
    queryKey: QUERY_KEYS.orders.list(filters),

    queryFn: async ({ pageParam = 1 }) => {
      return await getAllOrders({
        ...filters,
        PageNumber: pageParam as number,
        PageSize: filters.PageSize ?? 10, // Defaults to 10 if not explicitly provided
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      // Adjust these properties if your API returns different naming conventions for pagination
      if (lastPage.hasNextPage) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};

/**
 * 2. Fetch Order Items Hook
 */
export const useOrderItems = ({ OrderId }: OrderByIdParams) => {
  return useQuery<OrderItemsResponse, Error>({
    queryKey: [...QUERY_KEYS.orders.items(), OrderId],
    queryFn: () => getOrderItems({ OrderId }),
    enabled: !!OrderId, // Prevents query from running if OrderId is missing
  });
};

/**
 * 3. Fetch Order Details Hook
 */
export const useOrderDetails = ({ OrderId }: OrderByIdParams) => {
  return useQuery<OrderDetailsResponse, Error>({
    queryKey: [...QUERY_KEYS.orders.detail(), OrderId],
    queryFn: () => getOrderDetails({ OrderId }),
    enabled: !!OrderId,
  });
};

/**
 * 4. Fetch Order Status Statistics Hook
 */
export const useOrderStatusStatistics = ({
  WorkSiteId,
}: GetOrderStatusStatisticsParams) => {
  return useQuery<OrderStatusStatisticsResponse, Error>({
    queryKey: [...QUERY_KEYS.orders.stats(), WorkSiteId],
    queryFn: () => getOrderStatusStatistics({ WorkSiteId }),
    enabled: !!WorkSiteId,
  });
};