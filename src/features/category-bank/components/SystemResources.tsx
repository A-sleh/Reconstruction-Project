import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Inbox, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useResourcesInfinite } from "@/features/category-bank/api/quertes";
import { useDebounce } from "@/hooks/useDebounce";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import CategoryFilter from "./CategoryFilter";
import EmptyState from "@/components/common/EmptyState";

const SKELETON_ROWS = 5;

const SystemResources = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: resourcesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
  } = useResourcesInfinite({
    search: debouncedSearch,
    categoryId,
  });

  const allItems = resourcesData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4 w-full">
      {/* Header: Search + Category Filter */}
      <div className="flex gap-3 items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <div
            className="relative flex-1 max-w-xs rounded-lg bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "categoryBank.systemResources.searchPlaceholder",
                "Search resources...",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-full bg-transparent"
            />
          </div>
          <CategoryFilter
            value={categoryId}
            onValueChange={setCategoryId}
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  {t("categoryBank.systemResources.table.id", "ID")}
                </TableHead>
                <TableHead>
                  {t("categoryBank.systemResources.table.name", "Name")}
                </TableHead>
                <TableHead>
                  {t(
                    "categoryBank.systemResources.table.description",
                    "Description",
                  )}
                </TableHead>
                <TableHead>
                  {t("categoryBank.systemResources.table.category", "Category")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isPending
                ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={i} className="border-b border-gray-100">
                      <TableCell>
                        <Skeleton className="h-5 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-56" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : allItems.map((resource) => (
                    <TableRow
                      key={resource.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="tabular-nums text-muted-foreground">
                        {resource.id}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{resource.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                          {resource.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {resource.category?.name || "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}

              {!isLoading && !isPending && allItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-0 text-muted-foreground"
                  >
                    <EmptyState
                      icon={Inbox}
                      message={t(
                        "categoryBank.systemResources.table.empty",
                        "No resources found.",
                      )}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <LoadMoreButton
          onLoadMore={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
          hasMore={!!hasNextPage}
          total={allItems.length}
          totalLabel={t("categoryBank.systemResources.table.totalResources", {
            count: allItems.length,
          })}
        />
      </div>
    </div>
  );
};

export default SystemResources;
