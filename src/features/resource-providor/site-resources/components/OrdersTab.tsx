import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Loader2, Inbox, Plus } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBankItemRequests } from "@/features/category-bank/api/quertes";
import { BankItemStatus } from "@/features/category-bank/api/types";
import { cn } from "@/lib/utils";
import useQueryStringState from "@/hooks/useQueryStringState";
import { NewResorceRequestModel } from "./NewResorceRequestModel";

const statusStyles: Record<
  BankItemStatus,
  { bg: string; text: string; dot: string }
> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Accepted: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Resolved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

function BankItemStatusBadge({ status }: { status: BankItemStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

const SKELETON_ROWS = 5;

export default function OrdersTab() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useQueryStringState<BankItemStatus | "">("status");
  const [debouncedSearch, setDebouncedSearch] = useQueryStringState<string>("search");
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBankItemRequests({
      search: debouncedSearch || undefined,
      status: (statusFilter as BankItemStatus) || undefined,
      pageSize: 10,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      {/* Filters + Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "workSites.orders.filters.search_placeholder",
              )}
              className="pl-9 bg-white border-gray-200"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as BankItemStatus | "")
              }
              className="h-9 w-full sm:w-auto rounded-md border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
            >
              <option value="">
                {t(
                  "workSites.orders.filters.status_placeholder",
                )}
              </option>
              <option value="Pending">
                {t("workSites.orders.status.pending")}
              </option>
              <option value="Accepted">
                {t("workSites.orders.status.approved")}
              </option>
              <option value="Rejected">
                {t("workSites.orders.status.rejected")}
              </option>
              <option value="Resolved">Resolved</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <NewResorceRequestModel
          openButton={
            <Button
              size="sm"
              className="bg-primary text-white hover:opacity-90 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {t("workSites.orders.create_order")}
            </Button>
          }
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider ">
                {t("workSites.orders.table.columns.item")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("workSites.orders.table.columns.category")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("workSites.orders.table.columns.provider")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t(
                  "workSites.orders.table.columns.admin_note",
                )}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-center">
                {t("workSites.orders.table.columns.status")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow
                  key={`skel-${i}`}
                  className="border-b border-gray-100"
                >
                  <TableCell className="p-3">
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                      <div className="h-3 w-48 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="space-y-1.5">
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                      <div className="h-3 w-36 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3 text-center">
                    <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse mx-auto" />
                  </TableCell>
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Inbox}
                    message={t("workSites.orders.table.empty")}
                  />
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading &&
              items.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Item Name + Description */}
                  <TableCell className="p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.itemName}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-[260px]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="p-3">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {item.categoryName}
                    </span>
                  </TableCell>

                  {/* Provider Name + Note */}
                  <TableCell className="p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.providerName}
                      </p>
                      {item.providerNote && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-[200px]">
                          {item.providerNote}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Admin Note */}
                  <TableCell className="p-3">
                    {item.adminNote ? (
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-[200px]">
                        {item.adminNote}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="p-3 text-center">
                    <BankItemStatusBadge status={item.status} />
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>

        {/* Load More */}
        {hasNextPage && items.length > 0 && (
          <div className="border-t border-gray-100 p-3 flex justify-center">
            <button
              ref={loadMoreRef}
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("workSites.orders.table.loading_more")}
                </>
              ) : (
                t("workSites.orders.table.load_more")
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
