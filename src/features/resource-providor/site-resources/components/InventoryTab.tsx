import { AnimatePresence } from "framer-motion";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ResourceCard from "./ResourceCard";
import { useEffect, useState } from "react";
import { useBankCategories, useRWorkSiteResourcesInfinite } from "../api/query";
import { useParams } from "react-router";

export default function InventoryTab() {
  const { t, i18n } = useTranslation();
  const { siteId } = useParams();
  const isArabic = i18n.language == "ar";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );

  const { data: categoriesData } = useBankCategories();
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: resourcesData,
    fetchNextPage,
    hasNextPage,

    isFetchingNextPage,
  } = useRWorkSiteResourcesInfinite({
    categoryId: selectedCategory,
    search: debouncedSearch,
    workSiteId: Number(siteId),
  });

  const items = resourcesData?.pages.flatMap((page) => page.data) || [];

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] mb-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {t("resourceProvidor.workSites.filters.categories", "Categories")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {categories.length}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("resourceProvidor.workSites.filters.all")}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="relative w-full border border-gray-200 rounded-2xl bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "resourceProvidor.workSites.resource.search-placeholder",
              )}
              className="pr-9 w-full bg-transparent"
            />
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground bg-white">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              {t("resourceProvidor.workSites.no-resources-match")}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <AnimatePresence initial={false}>
                {items.map((r) => (
                  <ResourceCard key={r?.id} resource={r} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage
                  ? t("resourceProvidor.workSites.actions.loading-more", "Loading more...")
                  : t("resourceProvidor.workSites.actions.load-more", "Load more")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
