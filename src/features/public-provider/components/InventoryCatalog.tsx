import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDominImageURL } from "@/lib/helpers";
import type { PureResource } from "@/features/work-site-items/api/types";

interface InventoryCatalogProps {
  inventory: PureResource[];
}

const PAGE_SIZE = 6;

export default function InventoryCatalog({
  inventory,
}: InventoryCatalogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    inventory?.forEach((item) => {
      if (item.category) map.set(item.category.id, item.category.name);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [inventory]);

  const filtered = useMemo(() => {
    if (!inventory) return [];
    const term = search.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesCategory =
        categoryId === "all" ||
        (item.category && String(item.category.id) === categoryId);
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [inventory, search, categoryId]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={t("publicProvider.inventory.searchPlaceholder")}
            className="pl-9 bg-white"
          />
        </div>
        <Select
          value={categoryId}
          onValueChange={(value) => {
            setCategoryId(value);
            setVisibleCount(PAGE_SIZE);
          }}
        >
          <SelectTrigger
            className="w-full md:w-56 bg-white"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <SelectValue
              placeholder={t("publicProvider.inventory.allCategories")}
            />
          </SelectTrigger>
          <SelectContent dir={isArabic ? "rtl" : "ltr"}>
            <SelectItem value="all">
              {t("publicProvider.inventory.allCategories")}
            </SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={t("publicProvider.inventory.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
                <div className="relative h-36 overflow-hidden bg-muted">
                  <img
                    src={getDominImageURL(item.imageURL ?? "")}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute left-3 top-3 bg-white/90 backdrop-blur"
                  >
                    {item.category?.name ?? "-"}
                  </Badge>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-primary">
                        {item.price.toLocaleString()}
                      </span>
                      {item.unit && (
                        <span className="text-sm font-medium text-muted-foreground">
                          {t("publicProvider.inventory.pricePerUnit", {
                            unit: item.unit,
                          })}
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.isAvailable
                          ? "bg-success/10 text-success"
                          : "bg-warning/15 text-warning-foreground"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {item.isAvailable
                        ? t("publicProvider.inventory.available")
                        : t("publicProvider.inventory.unavailable")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <LoadMoreButton
        hasMore={visibleCount < filtered.length}
        onLoadMore={() =>
          setVisibleCount((count) => count + PAGE_SIZE)
        }
      />
    </div>
  );
}
