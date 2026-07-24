import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useServicesInfinite } from "@/features/category-bank/api/quertes";
import { useDebounce } from "@/hooks/useDebounce";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import EmptyState from "@/components/common/EmptyState";
import CategoryFilter from "./CategoryFilter";

const SKELETON_ROWS = 7;

export default function SystemServices() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useServicesInfinite({
      search: debouncedSearch,
      categoryId,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(
              "categoryBank.systemServices.searchPlaceholder",
              "Search services...",
            )}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <CategoryFilter
          value={categoryId}
          onValueChange={setCategoryId}
          className="w-full sm:w-52"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider w-12">
                #
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("categoryBank.systemServices.columns.name", "Name")}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t(
                  "categoryBank.systemServices.columns.description",
                  "Description",
                )}
              </TableHead>
              <TableHead className="p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {t("categoryBank.systemServices.columns.category", "Category")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow
                  key={`skel-${i}`}
                  className="border-b border-gray-100"
                >
                  <TableCell className="p-3">
                    <div className="h-4 w-6 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={Inbox}
                    message={t(
                      "categoryBank.systemServices.empty",
                      "No services found.",
                    )}
                  />
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              items.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="p-3 text-sm text-gray-500">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="p-3">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </p>
                  </TableCell>
                  <TableCell className="p-3">
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-md">
                      {item.description || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {item.serviceType?.name}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>

        <LoadMoreButton
          hasMore={hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </div>
    </div>
  );
}
