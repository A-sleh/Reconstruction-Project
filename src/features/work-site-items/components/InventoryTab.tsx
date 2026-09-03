import { useMemo, useState } from "react";

import { Filter, Pencil, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import CollapsibleFilter from "@/components/common/CollapsibleFilter";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryFilter from "@/features/category-bank/components/CategoryFilter";
import { StatusBadge } from "@/features/work-sites/components/StatusBadge";
import { getDominImageURL } from "@/lib/helpers";
import useAuthStore, { User } from "@/stores/useAuthStore";

import { useDeleteWorksiteItem } from "../api/actions";
import {
  useServicesInfinite,
  useWorkSiteResourcesInfinite,
} from "../api/queries";
import { PureResource } from "../api/types";
import ModifyResourceModel from "./ModifyResourceModel";
import { getRolePrefix } from "./NewResorceRequestModel";

interface InventoryTabProps {
  siteId?: string;
}

const SKELETON_ROWS = 5;

export default function InventoryTab({ siteId }: InventoryTabProps) {
  const { siteId: paramSiteId } = useParams();
  const effectiveSiteId = siteId || paramSiteId;
  const { t, i18n } = useTranslation();
  const { mutate: deleteWorkSiteItem, isPending: isDeleting } =
    useDeleteWorksiteItem();
  const isArabic = i18n.language == "ar";
  const providerRole =
    useAuthStore((s) => (s.user as User)?.providerRole) ?? "Resource";
  const rolePrefix = getRolePrefix(providerRole);
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hold">(
    "all",
  );
  const worksiteItemsInfinite =
    providerRole == "Service"
      ? useServicesInfinite
      : useWorkSiteResourcesInfinite;

  const {
    data: worksiteItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = worksiteItemsInfinite({
    categoryId,
    search,
    workSiteId: Number(effectiveSiteId),
  });

  const allItems: PureResource[] =
    worksiteItems?.pages.flatMap((page) => page.data) || [];

  const items = useMemo(() => {
    if (statusFilter === "all") return allItems;
    return allItems.filter((r) =>
      statusFilter === "active" ? r.isAvailable : !r.isAvailable,
    );
  }, [allItems, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Header with Search and Filter */}
      <div className="flex gap-2">
        <div
          className="relative w-full md:w-90 rounded-lg bg-white"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(`${rolePrefix}.inventory.search-placeholder`)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 w-full bg-transparent"
          />
        </div>
        <CollapsibleFilter
          trigger={
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              {t(`${rolePrefix}.inventory.filters`)}
            </span>
          }
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
            <CategoryFilter
              value={categoryId}
              onValueChange={setCategoryId}
              bankType={providerRole as "Resource" | "Service"}
            />
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | "active" | "hold")
              }
            >
              <SelectTrigger
                className="w-full md:w-fit"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <SelectValue
                  placeholder={t(`${rolePrefix}.inventory.filterByStatus`)}
                />
              </SelectTrigger>
              <SelectContent dir={isArabic ? "rtl" : "ltr"}>
                <SelectItem value="all">
                  {t(`${rolePrefix}.inventory.allStatuses`)}
                </SelectItem>
                <SelectItem value="active">
                  {t(`${rolePrefix}.inventory.active`)}
                </SelectItem>
                <SelectItem value="hold">
                  {t(`${rolePrefix}.inventory.onHold`)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleFilter>
      </div>

      {items.length === 0 && !isPending ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground bg-white">
          <div className="mx-auto w-fit mb-2 opacity-50">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p>{t(`${rolePrefix}.inventory.no-match`)}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="p-3 font-medium text-gray-500 w-24">
                  {t(`${rolePrefix}.inventory.table.image`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t(`${rolePrefix}.inventory.table.name`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t(`${rolePrefix}.inventory.table.category`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t(`${rolePrefix}.inventory.table.status`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t(`${rolePrefix}.inventory.table.price`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t(`${rolePrefix}.inventory.table.unit`)}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500 text-center w-48">
                  {t(`${rolePrefix}.inventory.table.actions`)}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={i} className="border-b border-gray-100">
                      <TableCell className="p-3">
                        <Skeleton className="h-16 w-16 rounded" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-5 w-20 rounded" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="p-3">
                        <Skeleton className="h-5 w-12" />
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : items.map((resource) => (
                    <TableRow
                      key={resource.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <TableCell className="p-3">
                        {resource.image?.url && (
                          <img
                            src={getDominImageURL(resource.image?.url)}
                            alt={resource.description}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        <p className="font-medium text-foreground line-clamp-1 max-w-xs">
                          {resource.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                          {resource.description}
                        </p>
                      </TableCell>
                      <TableCell className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {resource.category?.name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="p-3">
                        <StatusBadge
                          status={resource.isAvailable ? "active" : "on-hold"}
                        />
                      </TableCell>
                      <TableCell className="p-3">
                        <p className="font-semibold text-primary tabular-nums">
                          ${resource.price.toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell className="p-3">
                        <p className="font-medium tabular-nums">
                          {resource.unit}
                        </p>
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ModifyResourceModel
                            initial={resource}
                            key={"update-resource" + resource.id}
                            openButton={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <ConfirmDelete
                            item={resource?.name}
                            isLoading={isDeleting}
                            onConfirm={() =>
                              deleteWorkSiteItem({
                                Id: resource.id,
                                ItemType: "Resource",
                              })
                            }
                            openButton={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            isLoading={isFetchingNextPage}
            className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("workSites.actions.load-more", "Load more")}
          </Button>
        </div>
      )}
    </div>
  );
}
