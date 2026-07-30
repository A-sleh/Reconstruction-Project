import EmptyState from "@/components/common/EmptyState";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { Button } from "@/components/ui/button";
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
import { useDebounce } from "@/hooks/useDebounce";
import { Eye, Inbox, Pencil, Plus, Search, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateService,
  useDeleteService,
  useUpdateService,
} from "../api/actions";
import { useServicesInfinite } from "../api/quertes";
import CategoryFilter from "./CategoryFilter";
import { ServiceDetailsModal } from "./ServiceDetailsModal";
import { ServiceFormModal } from "./ServiceFormModal";
import { TagsManagerModal } from "./TagsManagerModal";

const SKELETON_ROWS = 5;

export default function SystemServices() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
  } = useServicesInfinite({
    search: debouncedSearch ?? undefined,
    categoryId: categoryId ?? "all",
  });

  const { mutate: createService } = useCreateService();
  const { mutate: updateService } = useUpdateService();
  const { mutate: deleteService } = useDeleteService();

  const allItems = itemsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-3 items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <div
            className="relative flex-1 max-w-xs rounded-lg bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "categoryBank.systemServices.searchPlaceholder",
                "Search services...",
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

        <ServiceFormModal
          onConfirm={(data) => createService(data)}
          openButton={
            <Button>
              <Plus className="h-4 w-4" />
              {t("categoryBank.table.addCategory", "Create Service")}
            </Button>
          }
        />
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  {t("categoryBank.systemServices.table.id", "ID")}
                </TableHead>
                <TableHead>
                  {t("categoryBank.systemServices.table.name", "Name")}
                </TableHead>
                <TableHead>
                  {t(
                    "categoryBank.systemServices.table.description",
                    "Description",
                  )}
                </TableHead>
                <TableHead>
                  {t("categoryBank.systemServices.table.category", "Category")}
                </TableHead>
                <TableHead>{t("categoryBank.table.tags", "Tags")}</TableHead>
                <TableHead className="w-28">
                  {t("categoryBank.table.actionsHead", "Actions")}
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
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : allItems.map((item) => {
                    const categoryName = item.serviceType?.name;

                    return (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="tabular-nums text-muted-foreground">
                          {item.id}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{item.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {item.description}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {categoryName || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.tags && item.tags.length > 0 ? (
                              item.tags.slice(0, 3).map((tag: any) => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                                >
                                  {tag.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TagsManagerModal
                              type={"service"}
                              itemId={item.id}
                              itemName={item.name}
                              initialTags={item.tags ?? []}
                              openButton={
                                <button
                                  title={t(
                                    "categoryBank.table.manageTags",
                                    "Manage Tags",
                                  )}
                                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                  <Tag className="h-3.5 w-3.5" />
                                </button>
                              }
                            />

                            <ServiceDetailsModal
                              service={item}
                              openButton={
                                <button
                                  title={t(
                                    "categoryBank.table.viewDetails",
                                    "View Details",
                                  )}
                                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              }
                            />

                            <ServiceFormModal
                              initialValues={{
                                name: item.name,
                                description: item.description,
                                serviceTypeId: item.serviceType?.id ?? 0,
                              }}
                              onConfirm={(data) =>
                                updateService({ id: item.id, ...data })
                              }
                              openButton={
                                <button
                                  title={t("categoryBank.table.edit", "Edit")}
                                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                              }
                            />

                            <ConfirmDelete
                              item={item.name}
                              onConfirm={() => deleteService(item.id)}
                              openButton={
                                <button
                                  title={t(
                                    "categoryBank.table.delete",
                                    "Delete",
                                  )}
                                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

              {!isLoading && !isPending && allItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-0 text-muted-foreground"
                  >
                    <EmptyState
                      icon={Inbox}
                      message={t(
                        "categoryBank.systemServices.table.empty",
                        "No services found.",
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
          totalLabel={t("categoryBank.systemServices.table.totalServices", {
            count: allItems.length,
          })}
        />
      </div>
    </div>
  );
}
