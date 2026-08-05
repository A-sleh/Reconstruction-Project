import EmptyState from "@/components/common/EmptyState";
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
import { useDebounce } from "@/hooks/useDebounce";
import { Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../api/actions";
import { useBankCategories } from "../api/quertes";
import { CategoryFormModal } from "./CategoryFormModal";

const SKELETON_COUNT = 6;

const SystemCategories = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"resource" | "service">(
    "resource",
  );
  const debouncedSearch = useDebounce(search, 300);

  const { data: categoriesData, isLoading } = useBankCategories({
    search: debouncedSearch || undefined,
    type: typeFilter === "resource" ? "Resource" : "Service",
  });
  const categories = categoriesData?.categories ?? [];

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t(
                "categoryBank.table.searchCategoriesPlaceholder",
                "Search categories...",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 bg-white border-gray-200 text-sm"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger
              className="w-40 bg-white border-gray-200"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <SelectValue
                placeholder={t(
                  "categoryBank.table.filterByType",
                  "Filter by type",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resource">
                {t("categoryBank.table.resource", "Resource")}
              </SelectItem>
              <SelectItem value="service">
                {t("categoryBank.table.service", "Service")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CategoryFormModal
          onConfirm={(payload) => createCategory(payload)}
          openButton={
            <Button className="gap-2 border-0">
              <Plus className="h-4 w-4" />
              {t("categoryBank.table.addCategory", "Add Category")}
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
            >
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Inbox}
          message={t("categoryBank.table.empty", "No categories found.")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">ID: {cat.id}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CategoryFormModal
                    initialName={cat.name}
                    onConfirm={(payload) =>
                      updateCategory({ id: cat.id, ...payload })
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
                    item={cat.name}
                    onConfirm={() => deleteCategory(cat.id)}
                    openButton={
                      <button
                        title={t("categoryBank.table.delete", "Delete")}
                        className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <p className="text-xs text-gray-400">
          {t("categoryBank.table.totalCategories", {
            count: categories.length,
            defaultValue: "{{count}} categories total",
          })}
        </p>
      )}
    </div>
  );
};

export default SystemCategories;
