import EmptyState from "@/components/common/EmptyState";
import SidebarFilters from "@/components/common/SidebarFilters";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import ShopCard from "@/components/shared/ShopCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/Skeleton";
import CartSheet from "@/features/cart/components/CartSheet";
import CategoryFilter from "@/features/category-bank/components/CategoryFilter";
import { useDebounce } from "@/hooks/useDebounce";
import useQueryStringState from "@/hooks/useQueryStringState";
import { Inbox, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GetAvailableItemsParams } from "../api/types";
import { toPureResource } from "../DTOs/toPureResource";
import { useAvailableItemsInfinite } from "../api/queries";

const SKELETON_CARDS = 6;

type Props = {
  providerType?: "Resource" | "Service";
  projectId: number;
  projectName: string;
};

const AllProvidorItems = ({
  providerType = "Resource",
  projectId,
  projectName,
}: Props) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useQueryStringState<string>(
    "searchTerm",
    "",
  );
  const [categoryId, setCategoryId] = useQueryStringState<number | "all">(
    "categoryId",
    "all",
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAvailableItemsInfinite({
    searchTerm: debouncedSearch,
    categoryId: categoryId === "all" ? undefined : Number(categoryId),
    type: providerType as GetAvailableItemsParams["Type"],
  });

  const allItems = data?.pages.flatMap((page) => page.data) ?? [];
  const totalRows = data?.pages[data.pages.length - 1]?.totalRows;

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryId("all");
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 sticky top-25 z-10 bg-white p-2 rounded-md">
            <span>
              {t(
                "workSiteItems.allProvidorItems.totalItems",
                "{{count}} items",
                {
                  count: totalRows ?? allItems.length,
                },
              )}
            </span>
            <CartSheet projectId={projectId} projectName={projectName} />
          </div>

          {isLoading ? (
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
            <EmptyState
              icon={Inbox}
              message={t(
                "workSiteItems.allProvidorItems.empty",
                "No items match your filters.",
              )}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allItems.map((item) => (
                <ShopCard
                  key={item.id}
                  item={item}
                  projectId={projectId}
                  getResourceDetails={toPureResource}
                />
              ))}
            </div>
          )}

          <LoadMoreButton
            onLoadMore={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasMore={!!hasNextPage}
          />
        </div>
        <SidebarFilters
          reset={resetFilters}
          activeCount={(searchTerm ? 1 : 0) + (categoryId !== "all" ? 1 : 0)}
        >
          <div className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Search className="ml-1 inline h-3.5 w-3.5" />
                {t("categoryBank.systemResources.searchPlaceholder", "Search")}
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

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("workSiteItems.allProvidorItems.categoryLabel", "Category")}
              </Label>
              <CategoryFilter
                value={categoryId === "all" ? "all" : Number(categoryId)}
                onValueChange={(value) =>
                  setCategoryId(value === "all" ? "all" : String(value))
                }
                className="w-full"
                bankType={providerType}
              />
            </div>
          </div>
        </SidebarFilters>
      </div>
    </div>
  );
};

export default AllProvidorItems;