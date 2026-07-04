import { AnimatePresence } from "framer-motion";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRWorkSiteResourcesInfinite } from "../api/queries";
import { useParams } from "react-router";

import ResourceCard from "./ResourceCard";
import useQueryStringState from "@/hooks/useQueryStringState";
import CategoryFilterPopup from "./CategoryFilterPopup";
import { Button } from "@/components/ui/button";

export default function InventoryTab() {
  const { siteId } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const [debouncedSearch, setDebouncedSearch] =
    useQueryStringState<string>("search");

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

  const items: any[] = resourcesData?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="">
      <div className="flex gap-2 items-center mb-4">
        <div
          className="relative w-90 rounded-lg bg-white"
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
        <CategoryFilterPopup onSelect={setSelectedCategory} />
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
