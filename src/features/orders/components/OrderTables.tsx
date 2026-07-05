import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrdersInfinite } from "../api/query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useApproveOrder } from "../api/actions";
import { GetOrderAllFilters, Order } from "../api/types";
import { OrderItemsDrawer } from "./OrderItemsDrawer";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderRowActions } from "./OrderRowActions";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { MOCK_ORDERS } from "../data/mockOrders";

const OrderTables = ({ filters }: { filters: GetOrderAllFilters }) => {
  const { t } = useTranslation();
  const [itemsFor, setItemsFor] = useState<number | null>(null);

  const approve = useApproveOrder();

  // Use mock data instead of API call
  const isLoading = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;
  const fetchNextPage = () => {};

  const rows: Order[] = useMemo(
    () => MOCK_ORDERS,
    [],
  );

  // const total = data?.pages[0]?.totalRows ?? 0;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4 w-full">
      <div className="mt-6 rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orders.table.columns.investor")}</TableHead>
                <TableHead className="text-right">
                  {t("orders.totalPrice")}
                </TableHead>
                <TableHead className="text-right">
                  {t("orders.addPaymentModal.labels.amount")}
                </TableHead>
                <TableHead className="text-right">
                  {t("orders.orderDetailsModal.fields.netTotal")}
                </TableHead>
                <TableHead className="w-40">
                  {t("orders.orderDetailsModal.fields.fulfillRate")}
                </TableHead>
                <TableHead>
                  {t("orders.orderDetailsModal.fields.status")}
                </TableHead>
                <TableHead>
                  {t("orders.orderDetailsModal.labels.requested")}
                </TableHead>
                <TableHead>{t("orders.addPaymentModal.labels.date")}</TableHead>
                <TableHead className="text-right">
                  {t("orders.table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-16 text-muted-foreground"
                  >
                    {t("orders.table.empty")}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div className="font-medium">{r.ownerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("orders.table.columns.investor")} #{r.ownerId}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    $
                    {r.totalPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    $
                    {r.totalDiscountValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    $
                    {r.netTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.fulfillRate} className="h-1.5" />
                      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                        {r.fulfillRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderRowActions
                      order={r}
                      onShowItems={() => setItemsFor(r.id)}
                      onApprove={() => approve.mutate({ OrderId: r.id })}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {isFetchingNextPage &&
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={`nx-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div ref={sentinelRef} className="h-8" />
        {!hasNextPage && rows.length > 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">
            {t("orders.listSubtitle")}
          </p>
        )}
      </div>
      <OrderItemsDrawer orderId={itemsFor} onClose={() => setItemsFor(null)} />
    </div>
  );
};

export default OrderTables;
