import EmptyState from "@/components/common/EmptyState";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/Skeleton";
import CategoryFilter from "@/features/category-bank/components/CategoryFilter";
import { useAvailableItemsInfinite } from "@/features/work-site-items/api/queries";
import { useDebounce } from "@/hooks/useDebounce";
import useQueryStringState from "@/hooks/useQueryStringState";
import {
  Boxes,
  Inbox,
  Layers,
  MapPin,
  Search,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AvailableItem, AvailableItemType } from "../api/types";

const SKELETON_CARDS = 6;

const AllProvidorItems = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useQueryStringState<string>(
    "searchTerm",
    "",
  );
  const [categoryId, setCategoryId] = useQueryStringState<number | "all">(
    "categoryId",
    "all",
  );
  const [type, setType] = useQueryStringState<"all" | AvailableItemType>(
    "type",
    "all",
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
  } = useAvailableItemsInfinite({
    searchTerm: debouncedSearch || undefined,
    categoryId: categoryId === "all" ? undefined : Number(categoryId),
    type: type === "all" ? undefined : (type as AvailableItemType),
  });

  const allItems = itemsData?.pages.flatMap((page) => page.data) ?? [];
  const totalRows = itemsData?.pages[0]?.totalRows;

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryId("all");
    setType("all");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {t("workSiteItems.allProvidorItems.heading", "Available Items")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            "workSiteItems.allProvidorItems.subheading",
            "Browse resources and services available from providers.",
          )}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          {totalRows !== undefined && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t(
                  "workSiteItems.allProvidorItems.totalItems",
                  "{{count}} items",
                  {
                    count: totalRows,
                  },
                )}
              </span>
            </div>
          )}

          {isLoading || isPending ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="space-y-3 p-0 pt-0">
                    <Skeleton className="h-44 w-full rounded-t-lg" />
                    <div className="space-y-3 p-4">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : allItems.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  icon={Inbox}
                  message={t(
                    "workSiteItems.allProvidorItems.empty",
                    "No items match your filters.",
                  )}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allItems.map((item) => (
                <AvailableItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <LoadMoreButton
            onLoadMore={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasMore={!!hasNextPage}
          />
        </div>
        <aside className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Search className="ml-1 inline h-3.5 w-3.5" />
                  {t(
                    "categoryBank.systemResources.searchPlaceholder",
                    "Search",
                  )}
                </Label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t(
                    "workSiteItems.allProvidorItems.searchPlaceholder",
                    "Search by name...",
                  )}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("workSiteItems.allProvidorItems.typeLabel", "Type")}
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["all", "Resource", "Service"] as const).map((itemType) => (
                    <Button
                      key={itemType}
                      type="button"
                      variant={type === itemType ? "default" : "outline"}
                      size="sm"
                      onClick={() => setType(itemType)}
                    >
                      {itemType === "all"
                        ? t("workSiteItems.allProvidorItems.all", "All")
                        : itemType === "Resource"
                          ? t(
                              "workSiteItems.allProvidorItems.resource",
                              "Resource",
                            )
                          : t(
                              "workSiteItems.allProvidorItems.service",
                              "Service",
                            )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t(
                    "workSiteItems.allProvidorItems.categoryLabel",
                    "Category",
                  )}
                </Label>
                <CategoryFilter
                  value={categoryId === "all" ? "all" : Number(categoryId)}
                  onValueChange={(value) =>
                    setCategoryId(value === "all" ? "all" : String(value))
                  }
                  className="w-full"
                  bankType={type === "Service" ? "Service" : "Resource"}
                />
              </div>

              <Separator />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={resetFilters}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                {t("workSiteItems.allProvidorItems.reset", "Reset filters")}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

function AvailableItemCard({ item }: { item: AvailableItem }) {
  const { t } = useTranslation();
  const isResource = item.itemType === "Resource";

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative h-44 overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
            {isResource ? (
              <Boxes className="h-12 w-12 text-primary/40" />
            ) : (
              <Wrench className="h-12 w-12 text-primary/40" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
              isResource ? "bg-amber-500" : "bg-sky-600"
            }`}
          >
            {isResource ? (
              <Boxes className="h-3 w-3" />
            ) : (
              <Wrench className="h-3 w-3" />
            )}
            {isResource
              ? t("workSiteItems.allProvidorItems.resource", "Resource")
              : t("workSiteItems.allProvidorItems.service", "Service")}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-lg font-semibold leading-tight drop-shadow">
            {item.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
            <Layers className="h-3 w-3" />
            {item.categoryName}
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              {t("categoryBank.systemResources.table.id", "Price")}
            </div>
            <div className="text-lg font-semibold text-primary">
              {item.price.toLocaleString()}
              {item.unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {t("workSiteItems.allProvidorItems.perUnit", "/ {{unit}}", {
                    unit: item.unit,
                  })}
                </span>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              item.isAvailable
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-gray-500/10 text-gray-600"
            }`}
          >
            {item.isAvailable
              ? t("workSiteItems.allProvidorItems.available", "Available")
              : t("workSiteItems.allProvidorItems.unavailable", "Unavailable")}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {item.providerName}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {item.workSiteName}
          </div>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AllProvidorItems;
