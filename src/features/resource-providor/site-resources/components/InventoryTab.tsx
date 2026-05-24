import { AnimatePresence } from "framer-motion";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ResourceCard from "./ResourceCard";
import { Resource } from "../api";
import { useMemo, useState } from "react";

interface Props {
  resources: Resource[];
}

export default function InventoryTab({ resources }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const filteredResources = resources.filter((r) => {
    const q = query.toLowerCase();
    const matchQ =
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    const matchC = categoryFilter === "all" || r.category === categoryFilter;
    return matchQ && matchC;
  });

  const siteCategories = useMemo(
    () => Array.from(new Set(resources.map((r) => r.category))).sort(),
    [resources],
  );

  return (
    <>
      <div
        className={`flex flex-col  sm:items-center sm:justify-between gap-4 mb-6 ${isArabic ? "sm:flex-row-reverse" : "sm:flex-row"}`}
      >
        <div className="flex flex-wrap gap-2" >
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
              categoryFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("resourceProvidor.workSites.filters.all")}
          </button>
          {siteCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                categoryFilter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-fit sm:w-80 border border-gray-200" dir={isArabic ? "rtl" : "ltr"}>
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("resourceProvidor.workSites.resource.search-placeholder")}
            className="pr-9 w-full bg-white"
          />
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
          {t("resourceProvidor.workSites.no-resources-match")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" dir={isArabic ? 'rtl' : "ltr"}>
          <AnimatePresence initial={false}>
            {filteredResources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
