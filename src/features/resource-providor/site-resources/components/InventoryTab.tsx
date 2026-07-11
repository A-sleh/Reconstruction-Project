import { useTranslation } from "react-i18next";
import {
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useParams } from "react-router";
import { useRWorkSiteResourcesInfinite } from "../api/queries";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Resource } from "../api/actions";

interface InventoryTabProps {
  siteId?: string;
}

const SKELETON_ROWS = 5;

export default function InventoryTab({ siteId }: InventoryTabProps) {
  const { siteId: paramSiteId } = useParams();
  const effectiveSiteId = siteId || paramSiteId;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const {
    data: resourcesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useRWorkSiteResourcesInfinite({
    categoryId: "all",
    search: "",
    workSiteId: Number(effectiveSiteId),
  });

  const items: Resource[] =
    resourcesData?.pages.flatMap((page) => page.data) || [];

  if (items.length === 0 && !isPending) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 items-center mb-4">
          <div
            className="relative w-90 rounded-lg bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "resourceProvidor.workSites.resource.search-placeholder",
              )}
              className="pr-9 w-full bg-transparent"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {t("resourceProvidor.workSites.resource.filter")}
          </Button>
        </div>
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground bg-white">
          <div className="mx-auto mb-2 opacity-50">
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
          <p>{t("resourceProvidor.workSites.no-resources-match")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filter */}
      <div className="flex gap-2 items-center mb-4">
        <div
          className="relative w-90 rounded-lg bg-white"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(
              "resourceProvidor.workSites.resource.search-placeholder",
            )}
            className="pr-9 w-full bg-transparent"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {t("resourceProvidor.workSites.resource.filter")}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="p-3 font-medium text-gray-500 w-24">
                {t("resourceProvidor.workSites.resource.table.image")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500">
                {t("resourceProvidor.workSites.resource.table.name")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500">
                {t("resourceProvidor.workSites.resource.table.category")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500">
                {t("resourceProvidor.workSites.resource.table.status")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500">
                {t("resourceProvidor.workSites.resource.table.price")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500">
                {t("resourceProvidor.workSites.resource.table.unit")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-center w-48">
                {t("resourceProvidor.workSites.resource.table.actions")}
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
                      {resource.imageUrl && (
                        <img
                          src={resource.imageUrl}
                          alt={resource.description}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="p-3">
                      <p className="font-medium text-foreground line-clamp-1 max-w-xs">
                        {resource.resourceBank?.name || resource.name}
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
                        <DropdownMenuTrigger >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 bg-white border-gray-300"
                        >
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent >
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => {
                                // We'll handle edit via ModifyResourceModel
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              {t("resourceProvidor.workSites.btn-edit", "Edit")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmDelete
                              item={
                                resource.resourceBank?.name || resource.name
                              }
                              onConfirm={() =>
                                console.log("delete", resource.id)
                              }
                              openButton={
                                <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  {t(
                                    "resourceProvidor.workSites.btn-delete",
                                    "Delete",
                                  )}
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

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
            {t("resourceProvidor.workSites.actions.load-more", "Load more")}
          </Button>
        </div>
      )}
    </div>
  );
}
