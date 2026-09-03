import { useState } from "react";

import {
  Boxes,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Inbox,
  LoaderCircle,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import CategoryFilter from "@/features/category-bank/components/CategoryFilter";
import { useAvailableItemsInfinite } from "@/features/work-site-items/api/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { getDominImageURL } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export interface NeedSelectionItem {
  itemType: "Resource" | "Service";
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

const SKELETON_COUNT = 4;

const itemAccent = {
  Resource: {
    chip: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    soft: "bg-emerald-500/5",
    bar: "from-emerald-500/60",
    iconRing: "bg-emerald-500/10 text-emerald-600",
    icon: Package,
  },
  Service: {
    chip: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    soft: "bg-amber-500/5",
    bar: "from-amber-500/60",
    iconRing: "bg-amber-500/10 text-amber-600",
    icon: Wrench,
  },
} as const;

const NeedsAndRequestsStep = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const selected: NeedSelectionItem[] = watch("needsItems") ?? [];

  const [tab, setTab] = useState<"Resource" | "Service">("Resource");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useAvailableItemsInfinite({
      searchTerm: debouncedSearch || undefined,
      categoryId: categoryId === "all" ? undefined : Number(categoryId),
      type: tab,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const setSelected = (next: NeedSelectionItem[]) => {
    setValue("needsItems", next, { shouldValidate: true });
  };

  const selectedTotal = selected.reduce((sum, s) => sum + s.quantity, 0);
  const estimatedTotal = selected.reduce(
    (sum, s) => sum + s.price * s.quantity,
    0,
  );
  const resourceCount = selected.filter(
    (s) => s.itemType === "Resource",
  ).length;
  const serviceCount = selected.filter((s) => s.itemType === "Service").length;

  const isAlreadySelected = (id: number) => selected.some((s) => s.id === id);

  const handleAdd = (item: {
    id: number;
    name: string;
    unit: string;
    price: number;
  }) => {
    if (isAlreadySelected(item.id)) return;
    setSelected([
      ...selected,
      {
        itemType: tab,
        id: item.id,
        name: item.name,
        unit: item.unit,
        price: item.price,
        quantity: 1,
      },
    ]);
  };

  const handleQuantity = (id: number, delta: number) => {
    setSelected(
      selected.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(1, s.quantity + delta) } : s,
      ),
    );
  };

  const handleRemove = (id: number) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const handleClearAll = () => setSelected([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">
            <Sparkles className="h-3 w-3" />
            {t("projectReports.create.needs.badge", "Materials & Services")}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-foreground">
            {t("projectReports.create.needs.title", "Needs & Requests")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "projectReports.create.needs.subTitle",
              "Select the resources and services this project needs and set their quantities.",
            )}
          </p>
        </div>
      </div>

      {/* Segmented tabs */}
      <div className="inline-flex w-full gap-2 sm:w-auto">
        {(["Resource", "Service"] as const).map((type) => {
          const accent = itemAccent[type];
          const count = type === "Resource" ? resourceCount : serviceCount;
          const Icon = accent.icon;
          const active = tab === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTab(type)}
              className={cn(
                "group flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-bold transition-all duration-200 sm:flex-none sm:px-6",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-card"
                  : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {type === "Resource"
                ? t("projectReports.create.needs.tabs.resources", "Resources")
                : t("projectReports.create.needs.tabs.services", "Services")}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : `${accent.chip} bg-opacity-100`,
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + category + results */}
      <div className="grid gap-3 md:grid-cols-[1fr_240px] ">
        <div className="flex gap-2 items-center">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t(
              "projectReports.create.needs.searchPlaceholder",
              "Search items...",
            )}
            className="outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchTerm("")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <Label className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("projectReports.create.needs.category", "Category")}
          </Label>
          <CategoryFilter
            value={categoryId}
            onValueChange={(v) => setCategoryId(v)}
            bankType={tab}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Available items */}
        <div
          className="space-y-4 h-90 overflow-auto "
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-center justify-between sticky top-0 z-10 bg-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(
                "projectReports.create.needs.itemsFound",
                "{{count}} item(s)",
                {
                  count: items.length,
                },
              )}
            </p>
            {tab === "Resource" && (
              <span className="text-[11px] font-medium text-muted-foreground">
                {t("projectReports.create.needs.per", "per")}{" "}
                {t("projectReports.create.needs.currency", "SYP")}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-card"
                >
                  <Skeleton className="h-24 w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              message={t(
                "projectReports.create.needs.empty",
                "No items match your search.",
              )}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const selectedItem = selected.find((s) => s.id === item.id);
                const accent = itemAccent[item.itemType];
                const Icon = accent.icon;
                return (
                  <article
                    key={item.id}
                    className={cn(
                      "group relative overflow-hidden rounded-md border bg-card shadow-card transition-all duration-300",
                      selectedItem
                        ? "border-primary/60 ring-2 ring-primary/15"
                        : "border-border/60 hover:-translate-y-0.5 hover:shadow-lg",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent",
                        accent.bar,
                      )}
                    />
                    <div className="flex gap-3 p-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          accent.iconRing,
                        )}
                      >
                        {item.image?.url ? (
                          <img
                            src={getDominImageURL(item.image.url)}
                            alt={item.name}
                            loading="lazy"
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-bold text-foreground">
                            {item.name}
                          </p>
                          {selectedItem && (
                            <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                              <Check className="h-3 w-3" />
                              {t("projectReports.create.needs.added", "Added")}
                            </span>
                          )}
                        </div>

                        {item.categoryName && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            <Boxes className="h-3 w-3" />
                            {item.categoryName}
                          </span>
                        )}

                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-extrabold tabular-nums text-primary">
                              {item.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {t("projectReports.create.needs.currency", "SYP")}
                              /{item.unit}
                            </span>
                          </div>

                          {selectedItem ? (
                            <div className="flex items-center gap-1.5 rounded-lg bg-muted/70 p-1">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => handleQuantity(item.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white hover:text-primary hover:shadow-sm"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold tabular-nums text-foreground">
                                {selectedItem.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => handleQuantity(item.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white hover:text-primary hover:shadow-sm"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="gap-1.5 border-primary/30 font-semibold text-primary hover:bg-primary hover:text-white"
                              onClick={() => handleAdd(item)}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              {t(
                                "projectReports.create.needs.add",
                                "Add to report",
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-1">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-border/70 font-semibold text-muted-foreground sm:w-auto sm:px-8"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {t("projectReports.create.needs.loading", "Loading...")}
                  </>
                ) : (
                  <>{t("projectReports.create.needs.loadMore", "Load more")}</>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Selected items panel */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <p className="text-sm font-extrabold text-foreground">
                  {t("projectReports.create.needs.selected", "Selected Items")}
                </p>
                {selectedTotal > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-extrabold tabular-nums text-white">
                    {selectedTotal}
                  </span>
                )}
              </div>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("projectReports.create.needs.clearAll", "Clear all")}
                </button>
              )}
            </div>

            {selected.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
                  <ShoppingCart className="h-5 w-5 text-primary/40" />
                </div>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                  {t(
                    "projectReports.create.needs.selectedEmpty",
                    "No items selected. Choose resources or services and add them with a quantity.",
                  )}
                </p>
              </div>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto p-3">
                {selected.map((s) => {
                  const accent = itemAccent[s.itemType];
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-xl border border-border/50 bg-white p-2.5 shadow-sm transition-colors hover:border-primary/30"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          accent.iconRing,
                        )}
                      >
                        <accent.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-foreground">
                          {s.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                          <CircleDollarSign className="h-3 w-3" />
                          <span>
                            {(s.price * s.quantity).toLocaleString()}{" "}
                            {t("projectReports.create.needs.currency", "SYP")}
                          </span>
                          <span className="text-border/60">·</span>
                          <span>
                            {s.price.toLocaleString()}/{s.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => handleQuantity(s.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-foreground">
                          {s.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => handleQuantity(s.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => handleRemove(s.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedTotal > 0 && (
              <div className="border-t border-border/50 bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    {t(
                      "projectReports.create.needs.totalItems",
                      "{{count}} item(s)",
                      { count: selectedTotal },
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {resourceCount}{" "}
                    {t("projectReports.create.needs.per", "per")} ·{" "}
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {serviceCount}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {t(
                      "projectReports.create.needs.subtotal",
                      "Estimated total",
                    )}
                  </span>
                  <span className="text-lg font-extrabold tabular-nums text-primary">
                    {estimatedTotal.toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t("projectReports.create.needs.currency", "SYP")}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedsAndRequestsStep;
