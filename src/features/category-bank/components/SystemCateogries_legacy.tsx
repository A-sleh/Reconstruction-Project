import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Pencil, Tag, Info, Plus, Filter } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { AddCategoryModal } from "./AddCategoryModal";
import { CategoryDetailsModal } from "./CategoryDetailsModal";
import { ManageTagsModal } from "./ManageTagsModal";
import { MOCK_SYSTEM_CATEGORIES, SystemCategory } from "../mock/categories";

const SystemCategories = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [categories, setCategories] = useState<SystemCategory[]>(
    MOCK_SYSTEM_CATEGORIES,
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const rows: SystemCategory[] = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        search === "" ||
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || cat.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [categories, search, typeFilter]);

  const handleAddCategory = (data: {
    name: string;
    description: string;
    type: "resource" | "service";
  }) => {
    const newCategory: SystemCategory = {
      id: categories.length + 1,
      name: data.name,
      description: data.description,
      type: data.type,
      usageCount: 0,
      tags: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDelete = (categoryId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleManageTags = (categoryId: number, tags: string[]) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, tags } : c)),
    );
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-3 items-center justify-between mb-4">
        <div className="flex gap-2">
          <div
            className="relative flex-1 max-w-xs rounded-lg bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "categoryBank.table.searchPlaceholder",
                "Search categories...",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-full bg-transparent"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue
                placeholder={t(
                  "categoryBank.table.filterByType",
                  "Filter by type",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("categoryBank.table.allTypes", "All Types")}
              </SelectItem>
              <SelectItem value="resource">
                {t("categoryBank.table.resource", "Resource")}
              </SelectItem>
              <SelectItem value="service">
                {t("categoryBank.table.service", "Service")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddCategoryModal
          onConfirm={handleAddCategory}
          openButton={
            <Button variant="default" className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t("categoryBank.table.addCategory", "Add Category")}
            </Button>
          }
        />
      </div>

      <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("categoryBank.table.category")}</TableHead>
                <TableHead>{t("categoryBank.table.type", "Type")}</TableHead>
                <TableHead>{t("categoryBank.table.tags", "Tags")}</TableHead>
                <TableHead>
                  {t("categoryBank.table.usageCount", "Usage")}
                </TableHead>
                <TableHead>{t("categoryBank.table.date")}</TableHead>
                <TableHead
                  className={`${isArabic ? "text-left" : "text-right"}`}
                >
                  {t("categoryBank.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                  >
                    {t("categoryBank.table.empty")}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {cat.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.type === "resource"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-indigo-500/10 text-indigo-600"
                      }`}
                    >
                      {cat.type === "resource"
                        ? t("categoryBank.table.resource", "Resource")
                        : t("categoryBank.table.service", "Service")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {cat.tags.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          {t("categoryBank.table.noTags", "—")}
                        </span>
                      ) : (
                        cat.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      )}
                      {cat.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{cat.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {cat.usageCount}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CategoryDetailsModal
                        category={cat}
                        openButton={
                          <Button
                            size="icon"
                            variant="ghost"
                            title={t(
                              "categoryBank.table.viewDetails",
                              "View Details",
                            )}
                            className="h-8 w-8"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        }
                      />

                      <ManageTagsModal
                        category={cat}
                        onConfirm={handleManageTags}
                        openButton={
                          <Button
                            size="icon"
                            variant="ghost"
                            title={t(
                              "categoryBank.table.manageTags",
                              "Manage Tags",
                            )}
                            className="h-8 w-8"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AddCategoryModal
                        initialState={cat}
                        openButton={
                          <Button
                            size="icon"
                            variant="ghost"
                            title={t("categoryBank.table.edit", "Edit")}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />

                      <ConfirmDelete
                        item={cat.name}
                        onConfirm={() => handleDelete(cat.id)}
                        openButton={
                          <Button
                            size="icon"
                            variant="ghost"
                            title={t("categoryBank.table.delete", "Delete")}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
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

        {rows.length > 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">
            {t("categoryBank.table.totalCategories", { count: rows.length })}
          </p>
        )}
      </div>
    </div>
  );
};

export default SystemCategories;
