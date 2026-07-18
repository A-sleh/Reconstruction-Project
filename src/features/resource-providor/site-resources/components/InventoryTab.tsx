import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, MoreVertical, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useParams } from "react-router";
import { useRWorkSiteResourcesInfinite, useBankCategories } from "../api/queries";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import ModifyResourceModel from "./ModifyResourceModel";
import CollapsibleFilter from "@/components/common/CollapsibleFilter";
import { PureResource } from "../api/types";
import { useDeleteWorksiteItem } from "../api/actions";

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
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hold">("all");

  const { data: categoriesData } = useBankCategories();
  const categories = useMemo(
    () =>
      Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.categories || [],
    [categoriesData],
  );

  const {
    data: resourcesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useRWorkSiteResourcesInfinite({
    categoryId,
    search,
    workSiteId: Number(effectiveSiteId),
  });

  const allItems: PureResource[] =
    resourcesData?.pages.flatMap((page) => page.data) || [];

  const items = useMemo(() => {
    if (statusFilter === "all") return allItems;
    return allItems.filter((r) =>
      statusFilter === "active" ? r.isAvailable : !r.isAvailable,
    );
  }, [allItems, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Header with Search and Filter */}
      <CollapsibleFilter
        trigger={
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4" />
            {t("workSites.resource.filters", "Filters")}
          </span>
        }
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
          <div
            className="relative w-full md:w-90 rounded-lg bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "workSites.resource.search-placeholder",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-full bg-transparent"
            />
          </div>
          <Select
            value={categoryId === "all" ? "all" : String(categoryId)}
            onValueChange={(value) =>
              setCategoryId(value === "all" ? "all" : Number(value))
            }
          >
            <SelectTrigger className="w-full md:w-fit" dir={isArabic ? "rtl" : "ltr"}>
              <SelectValue
                placeholder={t(
                  "workSites.resource.filterByCategory",
                  "Filter by category",
                )}
              />
            </SelectTrigger>
            <SelectContent dir={isArabic ? "rtl" : "ltr"}>
              <SelectItem value="all">
                {t("workSites.resource.allCategories", "All Categories")}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | "active" | "hold")}
          >
            <SelectTrigger className="w-full md:w-fit" dir={isArabic ? "rtl" : "ltr"}>
              <SelectValue
                placeholder={t(
                  "workSites.resource.filterByStatus",
                  "Filter by status",
                )}
              />
            </SelectTrigger>
            <SelectContent dir={isArabic ? "rtl" : "ltr"}>
              <SelectItem value="all">
                {t("workSites.resource.allStatuses", "All Statuses")}
              </SelectItem>
              <SelectItem value="active">
                {t("workSites.resource.active", "Active")}
              </SelectItem>
              <SelectItem value="hold">
                {t("workSites.resource.onHold", "On Hold")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleFilter>

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
          <p>{t("workSites.no-resources-match")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="p-3 font-medium text-gray-500 w-24">
                  {t("workSites.resource.table.image")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t("workSites.resource.table.name")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t("workSites.resource.table.category")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t("workSites.resource.table.status")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t("workSites.resource.table.price")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500">
                  {t("workSites.resource.table.unit")}
                </TableHead>
                <TableHead className="p-3 font-medium text-gray-500 text-center w-48">
                  {t("workSites.resource.table.actions")}
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
                        {resource.imageURL && (
                          <img
                            src={resource.imageURL}
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {resource.isAvailable ? "Active" : "On Hold"}
                        </span>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="bg-white border-gray-300">
                            <ModifyResourceModel
                              openButton={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="flex items-center gap-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                  {t(
                                    "workSites.btn-edit",
                                    "Edit",
                                  )}
                                </DropdownMenuItem>
                              }
                              initial={resource}
                              key={"update-resource" + resource.id}
                            />

                            <DropdownMenuSeparator />
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
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {t(
                                    "workSites.btn-delete",
                                    "Delete",
                                  )}
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
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
