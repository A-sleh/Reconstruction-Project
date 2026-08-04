import EmptyState from "@/components/common/EmptyState";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useApproveBankItemRequest,
  useRejectBankItemRequest,
  useResolveBankItemRequest,
} from "@/features/category-bank/api/actions";
import {
  useBankItemRequests,
  useUserBankItemRequests,
} from "@/features/category-bank/api/quertes";
import {
  BankItemStatus,
  ResolveRequestParams,
} from "@/features/category-bank/api/types";
import { useDebounce } from "@/hooks/useDebounce";
import useQueryStringState from "@/hooks/useQueryStringState";
import { motion } from "framer-motion";
import { Inbox, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import BankItemStatusBadge from "./BankItemStatusBadge";
import RequestActionsMenu from "./RequestActionsMenu";

import Can from "@/components/shared/Can";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewResorceRequestModel } from "@/features/work-site-items/components/NewResorceRequestModel";
import { Permissions } from "@/lib/permissions";
import useAuthStore from "@/stores/useAuthStore";

const SKELETON_ROWS = 7;

export default function BankItemsRequests() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((x) => x.user);
  const isArabic = i18n.language == "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useQueryStringState<
    BankItemStatus | ""
  >("status");
  const [debouncedSearch, setDebouncedSearch] =
    useQueryStringState<string>("search");

  const debouncedValue = useDebounce(search, 300);

  if (debouncedValue !== debouncedSearch) {
    setDebouncedSearch(debouncedValue);
  }

  const REQUESTS_STATUS_FILTERS = [
    { label: t("workSites.orders.filters.all"), value: "All" },
    { label: t("workSites.orders.status.pending"), value: "Pending" },
    { label: t("workSites.orders.status.approved"), value: "Accepted" },
    { label: t("workSites.orders.status.rejected"), value: "Rejected" },
    { label: t("workSites.orders.status.resolved"), value: "Resolved" },
  ];

  const useItemsRequests =
    user?.role == "Investor" ? useBankItemRequests : useUserBankItemRequests;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useItemsRequests({
      search: debouncedSearch || undefined,
      status:
        statusFilter == "All"
          ? undefined
          : (statusFilter as BankItemStatus) || undefined,
      pageSize: 10,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const { mutate: approveRequest, isPending: isApproving } =
    useApproveBankItemRequest();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectBankItemRequest();
  const { mutate: resolveRequest, isPending: isResolving } =
    useResolveBankItemRequest();

  const onApprove = (id: number) => {
    approveRequest(
      { RequestId: id },
      {
        onSuccess: () =>
          toast.success(
            t("categoryBank.toast.approveSuccess", {
              defaultValue: "Request approved",
            }),
          ),
        onError: () =>
          toast.error(
            t("categoryBank.toast.approveError", {
              defaultValue: "Failed to approve",
            }),
          ),
      },
    );
  };
  const onReject = (id: number, reason: string) => {
    rejectRequest(
      { requestId: id, adminNote: reason },
      {
        onSuccess: () =>
          toast.success(
            t("categoryBank.toast.rejectSuccess", {
              defaultValue: "Request rejected",
            }),
          ),
        onError: () =>
          toast.error(
            t("categoryBank.toast.rejectError", {
              defaultValue: "Failed to reject",
            }),
          ),
      },
    );
  };
  const onResolve = (payload: ResolveRequestParams) => {
    resolveRequest(payload, {
      onSuccess: () =>
        toast.success(
          t("categoryBank.toast.resolveSuccess", {
            defaultValue: "Request resolved",
          }),
        ),
      onError: () =>
        toast.error(
          t("categoryBank.toast.resolveError", {
            defaultValue: "Failed to resolve",
          }),
        ),
    });
  };
  const onCancel = (id: number) => {
    rejectRequest(
      {
        requestId: id,
        adminNote: t("categoryBank.toast.cancelledByAdmin", {
          defaultValue: "Cancelled by admin",
        }),
      },
      {
        onSuccess: () =>
          toast.success(
            t("categoryBank.toast.cancelSuccess", {
              defaultValue: "Request cancelled",
            }),
          ),
        onError: () =>
          toast.error(
            t("categoryBank.toast.cancelError", {
              defaultValue: "Failed to cancel",
            }),
          ),
      },
    );
  };

  const isProcessing = isApproving || isRejecting || isResolving;

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
              placeholder={t("workSites.orders.filters.search_placeholder")}
              className="pl-9 bg-white border-gray-200"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value: BankItemStatus) => setStatusFilter(value)}
            >
              <SelectTrigger
                className="w-full md:w-fit"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <SelectValue
                  placeholder={t("workSites.orders.filters.status_placeholder")}
                />
              </SelectTrigger>
              <SelectContent dir={isArabic ? "rtl" : "ltr"}>
                {REQUESTS_STATUS_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Can permission={Permissions.RESOURCES_ADD}>
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
        </Can>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider"></TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("workSites.orders.table.columns.provider")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider ">
                {t("workSites.orders.table.columns.item")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("workSites.orders.table.columns.category")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("workSites.orders.table.columns.admin_note")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-center">
                {t("workSites.orders.table.columns.status")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-center">
                {t("workSites.orders.table.columns.actions", {
                  defaultValue: "Actions",
                })}
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
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
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
                  <TableCell className="p-3 text-center">
                    <div className="h-8 w-8 rounded bg-gray-200 animate-pulse mx-auto" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={SKELETON_ROWS} className="p-0">
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
                  <TableCell className="p-3">{idx + 1}</TableCell>
                  {/* Provider Name + Note */}
                  <TableCell className="p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.providerName}
                      </p>
                      {item.providerNote && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-50">
                          {item.providerNote}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {/* Item Name + Description */}
                  <TableCell className="p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.itemName}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-65">
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

                  {/* Admin Note */}
                  <TableCell className="p-3">
                    {item.adminNote ? (
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-50">
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

                  {/* Actions */}
                  <TableCell className="p-3 text-center">
                    <RequestActionsMenu
                      requestId={item.id}
                      status={item.status}
                      isProcessing={isProcessing}
                      onApprove={(id) => onApprove(id)}
                      onReject={(id, reason) => onReject(id, reason)}
                      onResolve={(payload) => onResolve(payload)}
                      onCancel={(id) => onCancel(id)}
                    />
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>

        {/* Load More */}
        <LoadMoreButton
          hasMore={hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </div>
    </div>
  );
}
